import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Booking, Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import {
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  Receipt,
  XCircle,
} from 'lucide-react';

export const SavedOrders: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { savedListings, toggleSave, loading: savedLoading } = useSaved();

  const [activeTab, setActiveTab] = useState<'saved' | 'orders' | 'owner_history'>('saved');
  const [orders, setOrders] = useState<Booking[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Space owner history
  const [ownerListings, setOwnerListings] = useState<Listing[]>([]);
  const [ownerBookings, setOwnerBookings] = useState<Booking[]>([]);
  const [ownerStats, setOwnerStats] = useState({ totalBookings: 0, totalRevenue: 0 });
  const [ownerLoading, setOwnerLoading] = useState(false);

  // Cancellation modal
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Receipt modal
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const res = await api.get('/bookings/me');
        setOrders(res.data.data || []);
      } catch (err) {
        console.error('[Fetch Orders Error]', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    const fetchOwnerHistory = async () => {
      try {
        setOwnerLoading(true);
        const [listingsRes, bookingsRes] = await Promise.all([
          api.get('/owners/me/listings'),
          api.get('/owners/me/bookings'),
        ]);
        setOwnerListings(listingsRes.data.data || []);
        setOwnerBookings(bookingsRes.data.data || []);
        setOwnerStats(bookingsRes.data.stats || { totalBookings: 0, totalRevenue: 0 });
      } catch (err) {
        console.error('[Owner History Error]', err);
      } finally {
        setOwnerLoading(false);
      }
    };

    fetchOrders();
    if (user?.role === 'space_owner' || user?.roles?.includes('space_owner')) {
      fetchOwnerHistory();
    }
  }, [isAuthenticated, user]);

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForCancel) return;
    try {
      setCancelLoading(true);
      await api.post(`/bookings/${selectedBookingForCancel._id}/cancel`, {
        reason: cancelReason,
      });

      // Update state locally
      setOrders((prev) =>
        prev.map((b) =>
          b._id === selectedBookingForCancel._id
            ? { ...b, bookingStatus: 'cancellation_requested' }
            : b
        )
      );
      setSelectedBookingForCancel(null);
      setCancelReason('');
      alert('Cancellation request submitted successfully.');
    } catch (err: any) {
      alert(err.message || 'Error requesting cancellation');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="green">Confirmed</Badge>;
      case 'in_progress':
        return <Badge variant="blue">In Progress</Badge>;
      case 'completed':
        return <Badge variant="gray">Completed</Badge>;
      case 'cancellation_requested':
        return <Badge variant="amber">Cancellation Requested</Badge>;
      case 'cancelled':
        return <Badge variant="red">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="blue">Refunded</Badge>;
      default:
        return <Badge variant="amber">Pending Payment</Badge>;
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Saved Spots & Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your bookmarked advertising spaces, ongoing campaigns, and reservation history
          </p>

          {/* Tab Switcher */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'saved'
                  ? 'bg-[#FC5701] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Saved Spaces ({savedListings.length})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-[#FC5701] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              My Orders & Bookings ({orders.length})
            </button>

            {(user?.role === 'space_owner' || user?.roles?.includes('space_owner')) && (
              <button
                onClick={() => setActiveTab('owner_history')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'owner_history'
                    ? 'bg-[#FC5701] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Space Owner History ({ownerListings.length})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================
            TAB 1: SAVED SPACES
           ======================================================== */}
        {activeTab === 'saved' && (
          <div>
            {savedListings.length === 0 ? (
              <EmptyState
                title="No Saved Spaces Yet"
                description="Browse our verified offline advertising marketplace and bookmark spaces you love for upcoming campaigns."
                actionLabel="Explore Ads"
                onAction={() => navigate('/explore')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedListings.map(({ listing }) => (
                  <div
                    key={listing._id}
                    className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-card hover:border-[#FC5701] transition p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                        <img
                          src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80'}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => toggleSave(listing)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 shadow-md hover:bg-white"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Badge
                          variant={listing.isAvailable ? 'green' : 'red'}
                          size="sm"
                          className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs"
                        >
                          {listing.isAvailable ? 'Available' : 'Booked'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FC5701]" />
                        <span>
                          {listing.locality}, {listing.city}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {listing.title}
                      </h3>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-sm font-extrabold text-slate-950">
                        ₹{listing.price.toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-500 font-normal">
                          /{listing.pricingUnit?.replace('per_', '')}
                        </span>
                      </p>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/explore/${listing._id}`)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: PREVIOUS AND CURRENT ORDERS
           ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading your orders...</div>
            ) : orders.length === 0 ? (
              <EmptyState
                title="No Campaign Orders Found"
                description="You haven't booked any advertising spaces yet. Discover available hoardings and start your first offline campaign today."
                actionLabel="Explore Spaces"
                onAction={() => navigate('/explore')}
              />
            ) : (
              orders.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {booking.bookingReference}
                      </span>
                      {getStatusBadge(booking.bookingStatus)}
                      {booking.managedAds?.enabled && (
                        <span className="text-[10px] font-bold text-[#FC5701] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Managed Ads
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {booking.listing?.title || 'Advertising Placement Space'}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {booking.listing?.locality}, {booking.listing?.city} • Provider:{' '}
                      <span className="font-medium text-slate-700">
                        {typeof booking.provider === 'object'
                          ? (booking.provider as any).businessDetails?.companyName || (booking.provider as any).name
                          : 'Adspot Verified Provider'}
                      </span>
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(booking.startDate).toLocaleDateString()} to{' '}
                        {new Date(booking.endDate).toLocaleDateString()} ({booking.durationDays} Days)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Total Paid</p>
                      <p className="text-xl font-extrabold text-[#FC5701]">
                        ₹{booking.pricing?.totalAmount?.toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center md:justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Razorpay Verified
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Receipt className="w-3.5 h-3.5" />}
                        onClick={() => setSelectedBookingForReceipt(booking)}
                      >
                        Receipt
                      </Button>

                      {['confirmed', 'pending_payment'].includes(booking.bookingStatus) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs"
                          onClick={() => setSelectedBookingForCancel(booking)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: SPACE OWNER INVENTORY & BOOKINGS
           ======================================================== */}
        {activeTab === 'owner_history' && (
          <div className="space-y-8">
            {/* Revenue Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-semibold text-slate-500">Total Spaces Listed</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">
                  {ownerListings.length}
                </p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-semibold text-slate-500">Reservations Received</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">
                  {ownerStats.totalBookings}
                </p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
                <p className="text-xs font-semibold text-slate-500">Gross Space Earnings</p>
                <p className="text-2xl font-extrabold text-[#FC5701] mt-1">
                  ₹{ownerStats.totalRevenue.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Submitted Listings & Verification Status */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Your Submitted Advertising Spaces
                </h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/list-your-space')}
                >
                  + Add New Space
                </Button>
              </div>

              {ownerListings.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  You haven't submitted any advertising spaces yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {ownerListings.map((item) => (
                    <div key={item._id} className="py-4 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                          <Badge
                            variant={
                              item.verificationStatus === 'approved'
                                ? 'green'
                                : item.verificationStatus === 'pending'
                                ? 'amber'
                                : 'red'
                            }
                            size="sm"
                          >
                            {item.verificationStatus.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">
                          {item.locality}, {item.city} • ₹{item.price.toLocaleString('en-IN')}/
                          {item.pricingUnit?.replace('per_', '')}
                        </p>
                        {item.verificationStatus === 'rejected' && item.rejectionReason && (
                          <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg mt-1">
                            Reason: {item.rejectionReason}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/explore/${item._id}`)}
                      >
                        Inspect
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Request Modal */}
      <Modal
        isOpen={!!selectedBookingForCancel}
        onClose={() => setSelectedBookingForCancel(null)}
        maxWidth="md"
        title="Request Order Cancellation"
      >
        {selectedBookingForCancel && (
          <form onSubmit={handleCancelSubmit} className="space-y-4">
            <p className="text-xs text-slate-500">
              Booking Ref:{' '}
              <span className="font-mono font-bold text-slate-900">
                {selectedBookingForCancel.bookingReference}
              </span>
            </p>

            <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200">
              Cancellation is subject to Adspot's cancellation policy. If approved, eligible refunds
              will be credited to your original payment account.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reason for Cancellation
              </label>
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please state why you wish to cancel this booking..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#FC5701]"
              />
            </div>

            <Button
              type="submit"
              variant="danger"
              size="md"
              loading={cancelLoading}
              className="w-full"
            >
              Submit Cancellation Request
            </Button>
          </form>
        )}
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={!!selectedBookingForReceipt}
        onClose={() => setSelectedBookingForReceipt(null)}
        maxWidth="md"
        title="Booking Receipt"
      >
        {selectedBookingForReceipt && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Ref:</span>
                <span className="font-mono font-bold text-slate-900">
                  RCPT-{selectedBookingForReceipt.bookingReference}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Space:</span>
                <span className="font-bold text-slate-900">
                  {selectedBookingForReceipt.listing?.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span>
                  {new Date(selectedBookingForReceipt.startDate).toLocaleDateString()} to{' '}
                  {new Date(selectedBookingForReceipt.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Space Charges:</span>
                <span>₹{selectedBookingForReceipt.pricing?.spaceCharges?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Platform Fee (5%):</span>
                <span>₹{selectedBookingForReceipt.pricing?.platformFee?.toLocaleString('en-IN')}</span>
              </div>
              {selectedBookingForReceipt.pricing?.managedServiceFee > 0 && (
                <div className="flex justify-between text-[#FC5701]">
                  <span>Managed Ads Service (15%):</span>
                  <span>
                    ₹{selectedBookingForReceipt.pricing?.managedServiceFee?.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">GST (18%):</span>
                <span>₹{selectedBookingForReceipt.pricing?.taxAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Paid:</span>
                <span className="text-[#FC5701]">
                  ₹{selectedBookingForReceipt.pricing?.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
