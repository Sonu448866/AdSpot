import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  MapPin,
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  Building,
  Sparkles,
  ShieldCheck,
  Share2,
  AlertCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Info,
} from 'lucide-react';

export const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { isSaved, toggleSave } = useSaved();

  const [listing, setListing] = useState<Listing | null>(null);
  const [related, setRelated] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking form state
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(nextMonth);
  const [managedAds, setManagedAds] = useState(false);
  const [managedObjective, setManagedObjective] = useState('Brand Awareness');
  const [managedAudience, setManagedAudience] = useState('');
  const [managedBrief, setManagedBrief] = useState('');

  // Payment & confirmation modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/listings/${id}`);
        setListing(res.data.data);
        setRelated(res.data.related || []);
      } catch (err: any) {
        console.error('[Listing Detail Error]', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#FC5701] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading space specifications...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Space Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          This advertising space could not be found or is no longer available.
        </p>
        <Button variant="primary" onClick={() => navigate('/explore')}>
          Browse Available Spaces
        </Button>
      </div>
    );
  }

  // Calculate pricing breakdown
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  let unitDays = 30;
  if (listing.pricingUnit === 'per_day') unitDays = 1;
  else if (listing.pricingUnit === 'per_week') unitDays = 7;

  const baseRatePerDay = listing.price / unitDays;
  const spaceCharges = Math.round(baseRatePerDay * durationDays);
  const platformFee = Math.round(spaceCharges * 0.05);
  const managedFee = managedAds ? Math.round(spaceCharges * 0.15) : 0;
  const taxableTotal = spaceCharges + platformFee + managedFee;
  const taxAmount = Math.round(taxableTotal * 0.18);
  const finalTotal = taxableTotal + taxAmount;

  const handleInitiateBooking = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setBookingError(null);
    setIsCheckoutOpen(true);
  };

  const handleConfirmAndPay = async () => {
    try {
      setBookingLoading(true);
      setBookingError(null);

      // 1. Create Booking in MongoDB
      const bookingRes = await api.post('/bookings', {
        listingId: listing._id,
        startDate,
        endDate,
        managedAds,
        managedCampaignBrief: managedAds
          ? {
              objective: managedObjective,
              targetAudience: managedAudience,
              brief: managedBrief,
            }
          : undefined,
      });

      const newBooking = bookingRes.data.data;

      // 2. Create Payment Order
      const orderRes = await api.post('/payments/create-order', {
        bookingId: newBooking._id,
      });

      const { order } = orderRes.data;

      // 3. Verify Payment Server-Side
      const verifyRes = await api.post('/payments/verify', {
        razorpayOrderId: order.id,
        razorpayPaymentId: `pay_${Date.now()}`,
        razorpaySignature: 'simulated_verified_signature',
      });

      setConfirmedBooking({
        ...newBooking,
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
      });
    } catch (err: any) {
      console.error('[Payment Flow Error]', err);
      setBookingError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-slate-900">
              Explore Ads
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{listing.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Space Information (Left 8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Gallery Section */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="relative h-80 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={listing.images[activeImageIndex]?.url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="orange" size="md" className="capitalize bg-white/95 shadow-sm">
                    {listing.category.replace('_', ' ')}
                  </Badge>
                  <Badge variant="green" size="md" className="bg-white/95 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Partner
                  </Badge>
                </div>

                <button
                  onClick={() => toggleSave(listing)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition active:scale-95"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isSaved(listing._id) ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
                    }`}
                  />
                </button>
              </div>

              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {listing.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        activeImageIndex === i ? 'border-[#FC5701] ring-2 ring-orange-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Location Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FC5701]">
                <MapPin className="w-4 h-4" />
                <span>
                  {listing.locality}, {listing.city}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
                {listing.title}
              </h1>

              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>Address: {listing.address}</span>
              </p>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    {listing.owner?.businessDetails?.companyName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {listing.owner?.businessDetails?.companyName || listing.owner?.name || 'Verified Space Provider'}
                    </p>
                    <p className="text-[11px] text-slate-400">Registered Media Operator on Adspot</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Physical Inventory
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">About this Advertising Space</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Physical & Technical Specifications */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Technical Specifications</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Dimensions</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {listing.dimensions?.width} × {listing.dimensions?.height} {listing.dimensions?.unit}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Illumination</p>
                  <p className="text-sm font-bold text-slate-900 mt-1 capitalize">
                    {listing.specifications?.lighting?.replace('_', ' ') || 'Standard Front Lit'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Orientation</p>
                  <p className="text-sm font-bold text-slate-900 mt-1 capitalize">
                    {listing.specifications?.orientation?.replace('_', ' ') || 'Facing Traffic'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Material Requirement</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {listing.specifications?.material || 'Heavy Vinyl Flex'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Min Booking Period</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {listing.minBookingDuration || 7} Days
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-semibold text-[10px]">Sightline Clearance</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {listing.specifications?.clearanceView || 'Direct 200m clear visibility'}
                  </p>
                </div>
              </div>
            </div>

            {/* Audience & Location Characteristics */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Audience & Mobility Insights</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data aggregated from verified provider mobility logs and commercial zone analysis
                  </p>
                </div>
                <Badge variant="orange" size="sm">
                  Verified Data
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <p className="text-xs font-semibold text-slate-600">Estimated Daily Impressions</p>
                  <p className="text-2xl font-extrabold text-[#FC5701] mt-1">
                    {listing.audienceAttributes?.estimatedDailyImpressions?.toLocaleString('en-IN') || '25,000+'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Total vehicular & pedestrian visual reach</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-600">Estimated Daily Footfall</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {listing.audienceAttributes?.dailyFootfall?.toLocaleString('en-IN') || '15,000+'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Immediate junction and retail passersby</p>
                </div>
              </div>

              {listing.audienceAttributes?.targetDemographics && (
                <div>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Key Demographics Passing By
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {listing.audienceAttributes.targetDemographics.map((demo, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                      >
                        {demo}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {listing.audienceAttributes?.nearbyLandmarks && (
                <div>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Surrounding Landmarks & Transit
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {listing.audienceAttributes.nearbyLandmarks.map((lm, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3 text-[#FC5701]" />
                        {lm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cancellation & Refund Policy Box */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-700" />
                Cancellation & Refund Terms
              </h3>
              <p>
                Cancellations requested 15 days prior to campaign commencement are eligible for a 90%
                refund (excluding platform payment processing charges). Requests between 7–14 days are
                eligible for a 50% refund. Cancellations under 7 days cannot be refunded as physical
                space printing and allocation are finalized.
              </p>
            </div>
          </div>

          {/* Booking & Checkout Card (Right 5 cols Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
              {/* Rate Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Listed Price
                  </span>
                  <p className="text-2xl font-extrabold text-slate-950 mt-0.5">
                    ₹{listing.price.toLocaleString('en-IN')}
                    <span className="text-xs font-medium text-slate-500">
                      /{listing.pricingUnit?.replace('per_', '')}
                    </span>
                  </p>
                </div>
                <Badge variant={listing.isAvailable ? 'green' : 'red'}>
                  {listing.isAvailable ? 'Available Now' : 'Currently Booked'}
                </Badge>
              </div>

              {/* Date Selection */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select Campaign Dates
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Start Date</span>
                    <input
                      type="date"
                      value={startDate}
                      min={tomorrow}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-[#FC5701]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">End Date</span>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-[#FC5701]"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Selected duration:</span>
                  <span className="font-bold text-slate-900">{durationDays} Days</span>
                </div>
              </div>

              {/* Optional Adspot Managed Ads Toggle */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#FC5701] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Add Adspot Managed Ads</h4>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        Turnkey printing, mounting proof, and dedicated campaign coordination (+15%).
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={managedAds}
                    onChange={(e) => setManagedAds(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FC5701] focus:ring-[#FC5701] border-slate-300 mt-0.5 cursor-pointer"
                  />
                </div>

                {managedAds && (
                  <div className="pt-3 border-t border-orange-200/60 space-y-3 animate-fadeIn">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Campaign Objective
                      </label>
                      <select
                        value={managedObjective}
                        onChange={(e) => setManagedObjective(e.target.value)}
                        className="w-full p-2 bg-white border border-orange-200 rounded-lg text-xs"
                      >
                        <option>Brand Awareness</option>
                        <option>Product Launch</option>
                        <option>Local Store Footfall</option>
                        <option>Event Promotion</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Campaign Brief / Creative Notes
                      </label>
                      <textarea
                        rows={2}
                        value={managedBrief}
                        onChange={(e) => setManagedBrief(e.target.value)}
                        placeholder="Provide details on your creative guidelines, artwork delivery, or target audience..."
                        className="w-full p-2 bg-white border border-orange-200 rounded-lg text-xs outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Transparent Pricing Breakdown */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>
                    Space Charges ({durationDays} days @ ₹{Math.round(baseRatePerDay).toLocaleString('en-IN')}/day)
                  </span>
                  <span className="font-semibold text-slate-900">₹{spaceCharges.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Platform Service Fee (5%)</span>
                  <span className="font-semibold text-slate-900">₹{platformFee.toLocaleString('en-IN')}</span>
                </div>

                {managedAds && (
                  <div className="flex justify-between text-[#FC5701]">
                    <span>Managed Campaign Coordination (15%)</span>
                    <span className="font-semibold">₹{managedFee.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Applicable GST (18%)</span>
                  <span className="font-semibold text-slate-900">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">Total Payable Amount</span>
                  <span className="text-xl font-extrabold text-[#FC5701]">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-md"
                disabled={!listing.isAvailable}
                onClick={handleInitiateBooking}
              >
                {listing.isAvailable ? 'Proceed to Booking & Payment' : 'Space Currently Unavailable'}
              </Button>

              <p className="text-[11px] text-center text-slate-400">
                Guaranteed date lock-in • Double-booking prevention protected
              </p>
            </div>
          </div>
        </div>

        {/* Related Advertising Spaces */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200/80">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Similar Advertising Opportunities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/explore/${item._id}`)}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-[#FC5701] cursor-pointer transition p-4 flex flex-col justify-between"
                >
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.title}
                    className="h-36 w-full object-cover rounded-xl mb-3"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#FC5701] uppercase">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {item.locality}, {item.city}
                    </p>
                  </div>
                  <p className="text-xs font-extrabold text-slate-950 mt-3 pt-2 border-t border-slate-100">
                    ₹{item.price.toLocaleString('en-IN')}
                    <span className="text-[10px] font-normal text-slate-500">
                      /{item.pricingUnit?.replace('per_', '')}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Checkout & Payment Confirmation Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setConfirmedBooking(null);
        }}
        maxWidth="md"
      >
        {!confirmedBooking ? (
          <div className="space-y-5">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-[#FC5701] uppercase tracking-wider">
                Review Reservation
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Complete Your Booking</h3>
              <p className="text-xs text-slate-500 mt-0.5">{listing.title}</p>
            </div>

            {bookingError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Dates:</span>
                <span className="font-semibold text-slate-900">
                  {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()} ({durationDays} days)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Managed Service:</span>
                <span className="font-semibold text-slate-900">
                  {managedAds ? 'Yes (+15%)' : 'Standard Self-Managed'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="text-[#FC5701]">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200/80 text-[11px] text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FC5701] shrink-0" />
              <span>Razorpay Test Gateway: Server-side HMAC signature verification enabled.</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              loading={bookingLoading}
              className="w-full"
              onClick={handleConfirmAndPay}
            >
              Pay ₹{finalTotal.toLocaleString('en-IN')} & Confirm Reservation
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-32 h-32 mx-auto">
              <img
                src="/assets/Adspot_Mascoot_delivering.png"
                alt="Adspot Delivering"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>

            <h3 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your reservation reference <span className="font-mono font-bold text-slate-900">{confirmedBooking.bookingReference}</span> has been confirmed and payment verified.
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 text-left space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Payment Captured & Dates Locked
              </p>
              <p>The space owner has been notified to inspect and prepare the hoarding.</p>
            </div>

            <div className="flex gap-3 pt-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  navigate('/saved-orders');
                }}
              >
                View in Orders
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  navigate('/explore');
                }}
              >
                Explore More
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
