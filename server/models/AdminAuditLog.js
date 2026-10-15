import mongoose from 'mongoose';

const adminAuditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    targetRecordType: {
      type: String,
      required: true,
      enum: ['Listing', 'User', 'Booking', 'ContactEnquiry', 'ManagedCampaign', 'Payment'],
    },
    targetRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    previousStatus: String,
    newStatus: String,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const AdminAuditLog = mongoose.model(
  'AdminAuditLog',
  adminAuditLogSchema
);
