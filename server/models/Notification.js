import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'listing_submitted',
        'listing_approved',
        'listing_rejected',
        'booking_created',
        'booking_confirmed',
        'booking_cancelled',
        'payment_success',
        'payment_failed',
        'premium_unlocked',
        'campaign_update',
        'system',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
    relatedBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
