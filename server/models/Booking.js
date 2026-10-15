import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    advertiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      index: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    pricing: {
      spaceCharges: { type: Number, required: true },
      durationDays: { type: Number, required: true },
      platformFee: { type: Number, default: 0 },
      managedServiceFee: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 }, // 18% GST standard
      totalAmount: { type: Number, required: true },
    },
    bookingStatus: {
      type: String,
      enum: [
        'pending_payment',
        'confirmed',
        'in_progress',
        'completed',
        'cancellation_requested',
        'cancelled',
        'refund_pending',
        'refunded',
      ],
      default: 'pending_payment',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    managedAds: {
      enabled: { type: Boolean, default: false },
      objective: String,
      targetAudience: String,
      brief: String,
      status: {
        type: String,
        enum: ['not_applicable', 'brief_received', 'in_planning', 'campaign_active', 'completed'],
        default: 'not_applicable',
      },
    },
    cancellationReason: String,
    refundAmount: { type: Number, default: 0 },
    paymentReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model('Booking', bookingSchema);
