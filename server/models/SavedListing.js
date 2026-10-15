import mongoose from 'mongoose';

const savedListingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce uniqueness for the user-listing combination
savedListingSchema.index({ user: 1, listing: 1 }, { unique: true });

export const SavedListing = mongoose.model('SavedListing', savedListingSchema);
