import { Listing } from '../models/Listing.js';
import { Booking } from '../models/Booking.js';

export const getMyListings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { owner: req.user._id };

    if (status && status !== 'all') {
      filter.verificationStatus = status;
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });

    const counts = {
      all: await Listing.countDocuments({ owner: req.user._id }),
      pending: await Listing.countDocuments({ owner: req.user._id, verificationStatus: 'pending' }),
      approved: await Listing.countDocuments({ owner: req.user._id, verificationStatus: 'approved' }),
      rejected: await Listing.countDocuments({ owner: req.user._id, verificationStatus: 'rejected' }),
      suspended: await Listing.countDocuments({ owner: req.user._id, verificationStatus: 'suspended' }),
    };

    res.json({
      success: true,
      data: listings,
      counts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate('listing', 'title category address city locality price images')
      .populate('advertiser', 'name email phone businessDetails.companyName')
      .sort({ createdAt: -1 });

    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === 'paid' && b.bookingStatus !== 'cancelled')
      .reduce((sum, b) => sum + (b.pricing?.spaceCharges || 0), 0);

    res.json({
      success: true,
      data: bookings,
      stats: {
        totalBookings: bookings.length,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
