import mongoose from 'mongoose';

const premiumEntitlementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    entitlementType: {
      type: String,
      enum: ['audience_heatmap_24h', 'audience_heatmap_monthly', 'pro_insights'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'revoked'],
      default: 'active',
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    amountPaid: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PremiumEntitlement = mongoose.model(
  'PremiumEntitlement',
  premiumEntitlementSchema
);
