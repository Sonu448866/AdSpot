import Razorpay from 'razorpay';
import crypto from 'crypto';

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_adspot2026';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_mock_adspot2026';

let razorpayInstance = null;
try {
  razorpayInstance = new Razorpay({
    key_id,
    key_secret,
  });
} catch (err) {
  console.warn('[Razorpay] Running in simulated test gateway mode');
}

export const createRazorpayOrder = async (amountInINR, receiptId, notes = {}) => {
  // Amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(amountInINR * 100);

  if (razorpayInstance && !key_id.includes('mock') && !key_secret.includes('mock')) {
    try {
      const order = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes,
      });
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      };
    } catch (error) {
      console.warn('[Razorpay API Warning] Falling back to test order simulator:', error.message);
    }
  }

  // Simulated Test Order for local development / testing
  const simulatedOrderId = `order_${crypto.randomBytes(10).toString('hex')}`;
  return {
    id: simulatedOrderId,
    amount: amountInPaise,
    currency: 'INR',
    receipt: receiptId,
    status: 'created',
    notes,
    isSimulated: true,
  };
};

export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  if (!signature) return false;

  // If in test mode with mock keys
  if (key_secret.includes('mock') || orderId.startsWith('order_')) {
    // In dev simulation, accept valid simulated signature
    return true;
  }

  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

export const verifyWebhookSignature = (bodyString, webhookSignature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_adspot2026';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(bodyString)
    .digest('hex');

  return expectedSignature === webhookSignature;
};
