import mongoose from 'mongoose';

const managedCampaignSchema = new mongoose.Schema(
  {
    campaignReference: {
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
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      sparse: true,
    },
    objective: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    targetAudience: {
      type: String,
      required: true,
    },
    geographicPreferences: {
      cities: [String],
      localities: [String],
    },
    campaignBrief: {
      type: String,
      required: true,
    },
    operationalStatus: {
      type: String,
      enum: [
        'submitted',
        'assigned',
        'strategy_planning',
        'vendor_coordination',
        'in_execution',
        'completed',
        'on_hold',
      ],
      default: 'submitted',
      index: true,
    },
    assignedOperator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    progressHistory: [
      {
        status: String,
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ManagedCampaign = mongoose.model(
  'ManagedCampaign',
  managedCampaignSchema
);
