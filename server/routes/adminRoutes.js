import express from 'express';
import {
  getAdminOverview,
  getAdminListings,
  updateListingVerification,
  getAdminUsers,
  toggleUserStatus,
  getAdminBookings,
  updateBookingStatus,
  getAdminCampaigns,
  updateCampaignStatus,
  getAdminEnquiries,
  updateEnquiryStatus,
  getAdminAuditLogs,
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Strict authorization: all admin routes require authenticated admin
router.use(requireAuth, requireRole('admin'));

router.get('/overview', getAdminOverview);

// Listings verification management
router.get('/listings', getAdminListings);
router.patch('/listings/:id/verification', updateListingVerification);

// User management
router.get('/users', getAdminUsers);
router.patch('/users/:id/status', toggleUserStatus);

// Bookings & Payments
router.get('/bookings', getAdminBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

// Managed Ads campaigns
router.get('/campaigns', getAdminCampaigns);
router.patch('/campaigns/:id/status', updateCampaignStatus);

// Contact enquiries
router.get('/enquiries', getAdminEnquiries);
router.patch('/enquiries/:id', updateEnquiryStatus);

// Audit logs
router.get('/audit-logs', getAdminAuditLogs);

export default router;
