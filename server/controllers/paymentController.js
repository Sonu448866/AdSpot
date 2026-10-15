import { Payment } from '../models/Payment.js';
import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';
import { PremiumEntitlement } from '../models/PremiumEntitlement.js';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from '../config/razorpay.js';
import { createNotification } from '../services/notificationService.js';

export const createOrder = async (req, res) => {
  try {
    const { bookingId, entitlementType } = req.body;

    if (!bookingId && !entitlementType) {
      return res.status(400).json({
        success: false,
        message: 'Either bookingId or entitlementType is required',
      });
    }

    let amount = 0;
    let receiptId = '';
    let paymentType = 'booking';
    let booking = null;

    if (bookingId) {
      booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      if (booking.advertiser.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
      amount = booking.pricing.totalAmount;
      receiptId = `rcpt_${booking.bookingReference}`;
      paymentType = 'booking';
    } else if (entitlementType) {
      paymentType = 'premium_unlock';
      if (entitlementType === 'audience_heatmap_24h') {
        amount = 499; // 24-hour pass: ₹499
        receiptId = `rcpt_hm24_${req.user._id.toString().slice(-6)}`;
      } else if (entitlementType === 'audience_heatmap_monthly') {
        amount = 2999; // 30-day pass: ₹2,999
        receiptId = `rcpt_hm30_${req.user._id.toString().slice(-6)}`;
      } else {
        return res.status(400).json({ success: false, message: 'Invalid entitlement type' });
      }
    }

    const order = await createRazorpayOrder(amount, receiptId, {
      userId: req.user._id.toString(),
      paymentType,
      bookingId: bookingId || '',
      entitlementType: entitlementType || '',
    });

    const payment = await Payment.create({
      user: req.user._id,
      booking: booking ? booking._id : undefined,
      paymentType,
      razorpayOrderId: order.id,
      amount,
      currency: 'INR',
      status: 'created',
      meta: {
        isSimulated: order.isSimulated || false,
        entitlementType,
      },
    });

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        isSimulated: order.isSimulated || false,
      },
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('[Create Payment Order Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      });
    }

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment order record not found' });
    }

    // Server-side signature verification
    const isValid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId || 'simulated_pay_id',
      razorpaySignature || 'simulated_sig'
    );

    if (!isValid) {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: invalid signature.',
      });
    }

    payment.razorpayPaymentId = razorpayPaymentId || `pay_${Date.now()}`;
    payment.razorpaySignature = razorpaySignature || 'simulated_verified';
    payment.status = 'captured';
    await payment.save();

    // If Booking payment
    if (payment.paymentType === 'booking' && payment.booking) {
      const booking = await Booking.findById(payment.booking);
      if (booking) {
        booking.paymentStatus = 'paid';
        booking.bookingStatus = 'confirmed';
        booking.paymentReference = payment._id;
        await booking.save();

        // Lock date range in Listing to prevent any double-booking
        await Listing.findByIdAndUpdate(booking.listing, {
          $push: {
            bookedRanges: {
              startDate: booking.startDate,
              endDate: booking.endDate,
              bookingId: booking._id,
            },
          },
        });

        // Notifications
        await createNotification({
          userId: booking.advertiser,
          type: 'payment_success',
          title: 'Booking Confirmed!',
          message: `Your booking ${booking.bookingReference} has been successfully paid and confirmed.`,
          relatedBooking: booking._id,
        });

        await createNotification({
          userId: booking.provider,
          type: 'booking_confirmed',
          title: 'New Confirmed Booking',
          message: `Great news! An advertiser has booked your space for ₹${booking.pricing.spaceCharges.toLocaleString('en-IN')}.`,
          relatedBooking: booking._id,
          relatedListing: booking.listing,
        });
      }
    }

    // If Premium Heatmap Unlock payment
    if (payment.paymentType === 'premium_unlock') {
      const entitlementType = payment.meta?.entitlementType || 'audience_heatmap_24h';
      const durationHours = entitlementType === 'audience_heatmap_24h' ? 24 : 30 * 24;
      const expiryDate = new Date(Date.now() + durationHours * 60 * 60 * 1000);

      await PremiumEntitlement.create({
        user: payment.user,
        entitlementType,
        status: 'active',
        startDate: new Date(),
        expiryDate,
        payment: payment._id,
        amountPaid: payment.amount,
      });

      await createNotification({
        userId: payment.user,
        type: 'premium_unlocked',
        title: 'Audience Heatmap Unlocked!',
        message: `Your premium audience location heatmap access is now active until ${expiryDate.toLocaleString('en-IN')}.`,
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and transaction confirmed successfully',
      payment,
    });
  } catch (error) {
    console.error('[Verify Payment Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const bodyString = JSON.stringify(req.body);

    if (signature && !verifyWebhookSignature(bodyString, signature)) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    console.log(`[Razorpay Webhook Received] Event: ${event}`);

    if (event === 'payment.captured') {
      const paymentEntity = req.body.payload?.payment?.entity;
      if (paymentEntity?.order_id) {
        const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });
        if (payment && payment.status !== 'captured') {
          payment.status = 'captured';
          payment.razorpayPaymentId = paymentEntity.id;
          payment.webhookVerified = true;
          await payment.save();
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
