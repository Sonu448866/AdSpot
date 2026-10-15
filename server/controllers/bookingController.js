import crypto from 'crypto';
import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';
import { createNotification } from '../services/notificationService.js';
import { ManagedCampaign } from '../models/ManagedCampaign.js';

export const createBooking = async (req, res) => {
  try {
    const {
      listingId,
      startDate,
      endDate,
      managedAds = false,
      managedCampaignBrief = {},
    } = req.body;

    if (!listingId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID, start date, and end date are required',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date selection: end date must be strictly after start date',
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Advertising space not found' });
    }

    if (listing.verificationStatus !== 'approved' || !listing.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This space is not currently available for booking',
      });
    }

    // Calculate duration in days
    const diffTime = Math.abs(end - start);
    const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (listing.minBookingDuration && durationDays < listing.minBookingDuration) {
      return res.status(400).json({
        success: false,
        message: `Minimum booking duration for this space is ${listing.minBookingDuration} days. Selected: ${durationDays} days.`,
      });
    }

    // SERVER-SIDE CONFLICT CHECK (Double booking prevention)
    const hasOverlap = listing.bookedRanges.some((range) => {
      const rangeStart = new Date(range.startDate);
      const rangeEnd = new Date(range.endDate);
      return start < rangeEnd && end > rangeStart;
    });

    if (hasOverlap) {
      return res.status(409).json({
        success: false,
        message: 'Selected dates conflict with an existing confirmed reservation. Please choose different dates.',
      });
    }

    // Calculate exact pricing
    let unitDays = 30; // default for per_month
    if (listing.pricingUnit === 'per_day') unitDays = 1;
    else if (listing.pricingUnit === 'per_week') unitDays = 7;

    const basePerDay = listing.price / unitDays;
    const spaceCharges = Math.round(basePerDay * durationDays);
    const platformFee = Math.round(spaceCharges * 0.05); // 5% platform fee
    const managedServiceFee = managedAds ? Math.round(spaceCharges * 0.15) : 0; // 15% optional managed service
    const taxableAmount = spaceCharges + platformFee + managedServiceFee;
    const taxAmount = Math.round(taxableAmount * 0.18); // 18% GST standard
    const totalAmount = taxableAmount + taxAmount;

    // Generate unique booking reference
    const bookingRef = `BK-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const booking = await Booking.create({
      bookingReference: bookingRef,
      advertiser: req.user._id,
      listing: listing._id,
      provider: listing.owner,
      startDate: start,
      endDate: end,
      durationDays,
      pricing: {
        spaceCharges,
        durationDays,
        platformFee,
        managedServiceFee,
        taxAmount,
        totalAmount,
      },
      bookingStatus: 'pending_payment',
      paymentStatus: 'pending',
      managedAds: {
        enabled: Boolean(managedAds),
        objective: managedCampaignBrief.objective || '',
        targetAudience: managedCampaignBrief.targetAudience || '',
        brief: managedCampaignBrief.brief || '',
        status: managedAds ? 'brief_received' : 'not_applicable',
      },
    });

    // If managed ads chosen, also create tracked ManagedCampaign
    if (managedAds) {
      await ManagedCampaign.create({
        campaignReference: `MC-${bookingRef}`,
        advertiser: req.user._id,
        booking: booking._id,
        objective: managedCampaignBrief.objective || 'Brand Awareness',
        budget: totalAmount,
        targetAudience: managedCampaignBrief.targetAudience || 'General Public',
        geographicPreferences: {
          cities: [listing.city],
          localities: [listing.locality],
        },
        campaignBrief: managedCampaignBrief.brief || 'Managed campaign requested via Adspot checkout.',
        operationalStatus: 'submitted',
        progressHistory: [
          {
            status: 'submitted',
            note: 'Managed campaign initiated along with booking reservation.',
          },
        ],
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking initiated. Please proceed to payment to confirm reservation.',
      data: booking,
    });
  } catch (error) {
    console.error('[Create Booking Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ advertiser: req.user._id })
      .populate('listing', 'title category address city locality price images pricingUnit')
      .populate('provider', 'name businessDetails.companyName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('provider', 'name businessDetails.companyName email phone')
      .populate('advertiser', 'name email phone businessDetails.companyName');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isAdvertiser = booking.advertiser._id.toString() === req.user._id.toString();
    const isProvider = booking.provider._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAdvertiser && !isProvider && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestCancellation = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.advertiser.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (['completed', 'cancelled', 'refunded'].includes(booking.bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking with status "${booking.bookingStatus}"`,
      });
    }

    booking.bookingStatus = 'cancellation_requested';
    booking.cancellationReason = reason || 'Advertiser requested cancellation';
    await booking.save();

    await createNotification({
      userId: booking.advertiser,
      type: 'booking_cancelled',
      title: 'Cancellation Requested',
      message: `Your cancellation request for booking ${booking.bookingReference} has been received and is being processed according to policy.`,
      relatedBooking: booking._id,
    });

    res.json({
      success: true,
      message: 'Cancellation requested successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
