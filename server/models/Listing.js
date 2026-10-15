import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      index: 'text',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'billboard',
        'transit',
        'pamphlet',
        'poster',
        'retail',
        'digital_hoarding',
        'other',
      ],
      index: true,
    },
    format: {
      type: String,
      default: 'Physical Hoarding / Display',
    },
    dimensions: {
      width: { type: Number, default: 20 },
      height: { type: Number, default: 10 },
      unit: { type: String, default: 'ft' },
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    locality: {
      type: String,
      required: true,
      index: true,
    },
    postalCode: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
      },
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
      index: true,
    },
    pricingUnit: {
      type: String,
      enum: ['per_day', 'per_week', 'per_month'],
      default: 'per_month',
    },
    minBookingDuration: {
      type: Number,
      default: 7, // days
    },
    specifications: {
      lighting: {
        type: String,
        enum: ['front_lit', 'back_lit', 'non_lit', 'digital_led'],
        default: 'front_lit',
      },
      orientation: {
        type: String,
        enum: ['facing_traffic', 'cross_traffic', 'pedestrian', 'indoor'],
        default: 'facing_traffic',
      },
      material: String,
      clearanceView: String,
    },
    audienceAttributes: {
      estimatedDailyImpressions: { type: Number, default: 25000 },
      dailyFootfall: { type: Number, default: 15000 },
      targetDemographics: [String],
      nearbyLandmarks: [String],
      commercialZoneType: String,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Array of booked date ranges for double-booking prevention
    bookedRanges: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Geo index on coordinates
listingSchema.index({ location: '2dsphere' });
listingSchema.index({ city: 1, locality: 1, category: 1, price: 1 });

export const Listing = mongoose.model('Listing', listingSchema);
