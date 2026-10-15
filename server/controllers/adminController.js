import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { Booking } from '../models/Booking.js';
import { Payment } from '../models/Payment.js';
import { ManagedCampaign } from '../models/ManagedCampaign.js';
import { ContactEnquiry } from '../models/ContactEnquiry.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { PremiumEntitlement } from '../models/PremiumEntitlement.js';
import { createNotification } from '../services/notificationService.js';

export const getAdminOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdvertisers,
      totalSpaceOwners,
      totalListings,
      pendingListings,
      approvedListings,
      rejectedListings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      totalPayments,
      managedCampaignsCount,
      unresolvedEnquiries,
      premiumUnlocksCount,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'advertiser' }),
      User.countDocuments({ role: 'space_owner' }),
      Listing.countDocuments(),
      Listing.countDocuments({ verificationStatus: 'pending' }),
      Listing.countDocuments({ verificationStatus: 'approved' }),
      Listing.countDocuments({ verificationStatus: { $in: ['rejected', 'suspended'] } }),
      Booking.countDocuments({ bookingStatus: { $in: ['confirmed', 'in_progress'] } }),
      Booking.countDocuments({ bookingStatus: 'completed' }),
      Booking.countDocuments({ bookingStatus: { $in: ['cancelled', 'refunded'] } }),
      Payment.aggregate([
        { $match: { status: 'captured' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      ManagedCampaign.countDocuments(),
      ContactEnquiry.countDocuments({ status: { $ne: 'resolved' } }),
      PremiumEntitlement.countDocuments({ status: 'active' }),
    ]);

    const totalRevenue = totalPayments[0]?.total || 0;

    // Category distribution for charts
    const categoryDistribution = await Listing.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    // Status distribution
    const statusDistribution = [
      { name: 'Approved', count: approvedListings, fill: '#10B981' },
      { name: 'Pending', count: pendingListings, fill: '#F59E0B' },
      { name: 'Rejected/Suspended', count: rejectedListings, fill: '#EF4444' },
    ];

    // City distribution
    const cityDistribution = await Listing.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { city: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAdvertisers,
        totalSpaceOwners,
        totalListings,
        pendingListings,
        approvedListings,
        rejectedListings,
        activeBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        managedCampaignsCount,
        unresolvedEnquiries,
        premiumUnlocksCount,
      },
      charts: {
        categoryDistribution,
        statusDistribution,
        cityDistribution,
      },
    });
  } catch (error) {
    console.error('[Admin Overview Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminListings = async (req, res) => {
  try {
    const { status, category, city, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.verificationStatus = status;
    if (category && category !== 'all') filter.category = category;
    if (city && city !== 'all') filter.city = { $regex: city, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { locality: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('owner', 'name email phone businessDetails')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Listing.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: listings,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateListingVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, adminNotes } = req.body;

    if (!['approved', 'rejected', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    const listing = await Listing.findById(id).populate('owner');
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const previousStatus = listing.verificationStatus;
    listing.verificationStatus = status;
    listing.verifiedBy = req.user._id;
    listing.verifiedAt = new Date();

    if (status === 'rejected') {
      listing.rejectionReason = rejectionReason || 'Information provided does not meet verification guidelines';
    } else {
      listing.rejectionReason = '';
    }

    if (adminNotes) {
      listing.adminNotes = adminNotes;
    }

    await listing.save();

    // Log admin audit
    await AdminAuditLog.create({
      admin: req.user._id,
      action: `VERIFICATION_${status.toUpperCase()}`,
      targetRecordType: 'Listing',
      targetRecordId: listing._id,
      previousStatus,
      newStatus: status,
      metadata: { rejectionReason, adminNotes },
    });

    // Notify owner
    const notifType = status === 'approved' ? 'listing_approved' : 'listing_rejected';
    const notifTitle = status === 'approved' ? 'Listing Approved & Live!' : 'Listing Verification Update';
    const notifMsg =
      status === 'approved'
        ? `Congratulations! Your advertising space "${listing.title}" is now verified and live on the Adspot marketplace.`
        : `Your listing "${listing.title}" was rejected: ${listing.rejectionReason}. Please update the details and resubmit.`;

    await createNotification({
      userId: listing.owner._id,
      type: notifType,
      title: notifTitle,
      message: notifMsg,
      relatedListing: listing._id,
    });

    res.json({
      success: true,
      message: `Listing status updated to "${status}"`,
      data: listing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const filter = { role: { $ne: 'admin' } };

    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password -otpCode')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot modify admin account status' });
    }

    const previousStatus = user.status;
    user.status = status;
    await user.save();

    await AdminAuditLog.create({
      admin: req.user._id,
      action: `USER_STATUS_${status.toUpperCase()}`,
      targetRecordType: 'User',
      targetRecordId: user._id,
      previousStatus,
      newStatus: status,
    });

    res.json({
      success: true,
      message: `User status changed to ${status}`,
      user: { id: user._id, name: user.name, status: user.status },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.bookingStatus = status;

    const bookings = await Booking.find(filter)
      .populate('advertiser', 'name email phone businessDetails')
      .populate('provider', 'name email phone businessDetails')
      .populate('listing', 'title category price city locality')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const previousStatus = booking.bookingStatus;
    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    await booking.save();

    await AdminAuditLog.create({
      admin: req.user._id,
      action: 'UPDATE_BOOKING_STATUS',
      targetRecordType: 'Booking',
      targetRecordId: booking._id,
      previousStatus,
      newStatus: bookingStatus || previousStatus,
      metadata: { paymentStatus },
    });

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminCampaigns = async (req, res) => {
  try {
    const campaigns = await ManagedCampaign.find()
      .populate('advertiser', 'name email phone businessDetails')
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { operationalStatus, note } = req.body;

    const campaign = await ManagedCampaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    campaign.operationalStatus = operationalStatus;
    campaign.progressHistory.push({
      status: operationalStatus,
      note: note || `Campaign updated to ${operationalStatus}`,
      updatedBy: req.user._id,
      timestamp: new Date(),
    });
    await campaign.save();

    await createNotification({
      userId: campaign.advertiser,
      type: 'campaign_update',
      title: 'Managed Campaign Update',
      message: `Your campaign ${campaign.campaignReference} status changed to "${operationalStatus}". Note: ${note || 'In progress'}`,
    });

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminEnquiries = async (req, res) => {
  try {
    const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const enquiry = await ContactEnquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    if (status) enquiry.status = status;
    if (internalNotes !== undefined) enquiry.internalNotes = internalNotes;
    enquiry.assignedAdmin = req.user._id;
    await enquiry.save();

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminAuditLogs = async (req, res) => {
  try {
    const logs = await AdminAuditLog.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
