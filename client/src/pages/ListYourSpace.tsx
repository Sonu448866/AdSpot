import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Upload,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building,
  Image as ImageIcon,
  DollarSign,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  X,
  HelpCircle,
  Lock,
  RefreshCw,
  LogOut,
  Building2,
} from 'lucide-react';

export const ListYourSpace: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal, fastDemoLogin, logout, updateUser } = useAuth();

  const isSpaceOwner = isAuthenticated && (user?.role === 'space_owner' || user?.role === 'admin');
  const isAdvertiser = isAuthenticated && user?.role === 'advertiser';

  const [upgradingRole, setUpgradingRole] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedListing, setSubmittedListing] = useState<any | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('billboard');
  const [format, setFormat] = useState('Unipole Cantilever Billboard');
  const [description, setDescription] = useState('');

  // Dimensions
  const [width, setWidth] = useState(30);
  const [height, setHeight] = useState(15);
  const [unit, setUnit] = useState('ft');

  // Location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState('19.0760');
  const [longitude, setLongitude] = useState('72.8777');

  // Pricing
  const [price, setPrice] = useState('');
  const [pricingUnit, setPricingUnit] = useState('per_month');
  const [minBookingDuration, setMinBookingDuration] = useState(7);

  // Specifications
  const [lighting, setLighting] = useState('front_lit');
  const [orientation, setOrientation] = useState('facing_traffic');
  const [material, setMaterial] = useState('Heavy Duty Frontlit Flex');

  // Audience
  const [impressions, setImpressions] = useState(50000);
  const [footfall, setFootfall] = useState(25000);

  // Images
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleUpgradeToOwner = async () => {
    try {
      setUpgradingRole(true);
      setError(null);
      const res = await api.patch('/auth/profile', { role: 'space_owner' });
      updateUser(res.data.user);
    } catch (err: any) {
      setError(err.message || 'Failed to update account role');
    } finally {
      setUpgradingRole(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal('login', 'space_owner');
      return;
    }

    if (!isSpaceOwner) {
      setError('You must be logged in as a verified Space Owner to list advertising spaces.');
      return;
    }

    if (!title || !description || !address || !city || !locality || !price) {
      setError('Please fill out all required fields marked with an asterisk (*).');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('format', format);
      formData.append('dimensions', JSON.stringify({ width, height, unit }));
      formData.append('address', address);
      formData.append('city', city);
      formData.append('locality', locality);
      formData.append('postalCode', postalCode);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('price', price);
      formData.append('pricingUnit', pricingUnit);
      formData.append('minBookingDuration', String(minBookingDuration));
      formData.append(
        'specifications',
        JSON.stringify({ lighting, orientation, material })
      );
      formData.append(
        'audienceAttributes',
        JSON.stringify({
          estimatedDailyImpressions: impressions,
          dailyFootfall: footfall,
        })
      );

      // Append image files
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSubmittedListing(res.data.data);
    } catch (err: any) {
      console.error('[Submit Listing Error]', err);
      setError(err.message || 'Failed to submit advertising space.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#FC5701] uppercase tracking-widest">
              Space Provider Onboarding
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            List Your Advertising Space
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
            Reach thousands of corporate advertisers, local business owners, and media planners
            looking for verified offline advertising inventory.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6">
        {!isAuthenticated ? (
          /* Authentication Gate: User is not logged in */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl max-w-2xl mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FC5701] shadow-inner">
              <Building2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100/70 text-[#FC5701] uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" /> Space Owner Account Required
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Log In as a Space Owner to Continue
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                To list and monetize your billboard, unipole, transit, or offline advertising space on AdSpot, you must be signed in with a registered Space Owner account.
              </p>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-900">100% Free Listing</p>
                <p className="text-[11px] text-slate-500 mt-0.5">No upfront onboarding or catalog listing fees</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-900">Verified Demand</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Direct booking inquiries from verified media buyers</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-900">Full Payout Control</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Set daily rates, approvals, & availability</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="md"
                onClick={() => openAuthModal('login', 'space_owner')}
                className="w-full sm:w-auto font-semibold px-6 shadow-sm"
              >
                Sign In as Space Owner
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => openAuthModal('register', 'space_owner')}
                className="w-full sm:w-auto font-semibold px-6 border-slate-300"
              >
                Register New Owner Account
              </Button>
            </div>

            {/* Quick Demo Login Shortcut */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 mb-2">Testing or evaluating AdSpot?</p>
              <button
                type="button"
                onClick={() => fastDemoLogin('space_owner')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-[#FC5701] text-xs font-medium border border-slate-200 transition"
              >
                ⚡ 1-Click Demo Login as Space Owner (owner@adspot.com)
              </button>
            </div>
          </div>
        ) : isAdvertiser ? (
          /* Role conflict gate: User is logged in, but as an Advertiser */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl max-w-2xl mx-auto text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-inner">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/70 text-amber-800 uppercase tracking-wider">
                Role Conflict: Logged in as Advertiser
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Space Owner Account Required
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                You are currently signed in as <strong className="text-slate-800">{user?.name}</strong> ({user?.email}) with an <strong>Advertiser</strong> role. Advertisers can browse and book offline media, but only registered <strong>Space Owners</strong> can list inventory.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-2">
              <p className="text-xs font-bold text-slate-800">Choose how you'd like to proceed:</p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Upgrade your current account to a Space Owner role (instant, keeps your profile)</li>
                <li>Sign in or register with a dedicated Space Owner account</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="md"
                loading={upgradingRole}
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={handleUpgradeToOwner}
                className="w-full sm:w-auto font-semibold px-6 shadow-sm"
              >
                Upgrade This Account to Space Owner
              </Button>
              <Button
                variant="outline"
                size="md"
                icon={<LogOut className="w-4 h-4" />}
                onClick={() => {
                  logout();
                  openAuthModal('login', 'space_owner');
                }}
                className="w-full sm:w-auto font-semibold px-6 border-slate-300"
              >
                Sign In with Another Account
              </Button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => fastDemoLogin('space_owner')}
                className="text-slate-600 hover:text-[#FC5701] font-medium transition"
              >
                ⚡ Fast Demo Switch to Space Owner
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="text-slate-500 hover:text-slate-900 transition"
              >
                Return to Explore Ads
              </button>
            </div>
          </div>
        ) : !submittedListing ? (
          /* Submission form for authenticated space owners / admins */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-8"
          >
            {/* Authenticated Space Owner Status Banner */}
            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Logged in as Space Owner: <strong>{user?.name}</strong> ({user?.email})
                </span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full capitalize">
                Verified Provider
              </span>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Space Overview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building className="w-5 h-5 text-[#FC5701]" />
                <h3 className="text-base font-bold text-slate-900">1. Space Overview</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Prime Cantilever Unipole - Western Express Highway, Andheri East"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Advertising Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  >
                    <option value="billboard">Billboards & Hoardings</option>
                    <option value="transit">Bus & Transit Advertising</option>
                    <option value="pamphlet">Pamphlet Distribution</option>
                    <option value="poster">Posters & Banners</option>
                    <option value="retail">Retail & Commercial Spaces</option>
                    <option value="digital_hoarding">Digital LED Screen</option>
                    <option value="other">Other Offline Format</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specific Placement Format
                  </label>
                  <input
                    type="text"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    placeholder="e.g. Unipole Cantilever, Bus Side Panel, Mall Standee..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe sightline visibility, surroundings, traffic flows, lighting schedule, and booking rules..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                />
              </div>
            </div>

            {/* Section 2: Dimensions & Technical Specifications */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Sparkles className="w-5 h-5 text-[#FC5701]" />
                <h3 className="text-base font-bold text-slate-900">
                  2. Dimensions & Specifications
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Width
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Height
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  >
                    <option value="ft">Feet (ft)</option>
                    <option value="m">Meters (m)</option>
                    <option value="in">Inches (in)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Illumination
                  </label>
                  <select
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  >
                    <option value="front_lit">Front Lit</option>
                    <option value="back_lit">Back Lit</option>
                    <option value="digital_led">Digital LED</option>
                    <option value="non_lit">Non Lit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  >
                    <option value="facing_traffic">Facing Traffic</option>
                    <option value="cross_traffic">Cross Traffic</option>
                    <option value="pedestrian">Pedestrian View</option>
                    <option value="indoor">Indoor Kiosk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Recommended Material
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. Frontlit Flex 440 GSM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Exact Location & Coordinates */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-[#FC5701]" />
                <h3 className="text-base font-bold text-slate-900">3. Location & Coordinates</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. WEH Flyover Pillar 14, Near Gundavali Metro Station, Andheri East"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Locality / Suburb *
                  </label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Andheri East, Bandra West"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400069"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Pricing & Minimum Duration */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <DollarSign className="w-5 h-5 text-[#FC5701]" />
                <h3 className="text-base font-bold text-slate-900">4. Pricing & Booking Rules</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Rate (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Pricing Unit *
                  </label>
                  <select
                    value={pricingUnit}
                    onChange={(e) => setPricingUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  >
                    <option value="per_month">Per Month</option>
                    <option value="per_week">Per Week</option>
                    <option value="per_day">Per Day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Min Booking Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={minBookingDuration}
                    onChange={(e) => setMinBookingDuration(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Photographs & Media Upload */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <ImageIcon className="w-5 h-5 text-[#FC5701]" />
                <h3 className="text-base font-bold text-slate-900">
                  5. Space Photographs (Cloudinary / Verified Upload)
                </h3>
              </div>

              <div className="border-2 border-dashed border-slate-200 hover:border-[#FC5701] rounded-3xl p-6 text-center cursor-pointer transition bg-slate-50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="listing-photos-input"
                />
                <label htmlFor="listing-photos-input" className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">
                    Click to upload photographs of your space
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    PNG, JPG, or WEBP up to 10MB per image. Show clear daytime & illuminated views.
                  </p>
                </label>
              </div>

              {/* Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative h-24 rounded-xl overflow-hidden border border-slate-200">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verification Notice */}
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 text-xs text-slate-700 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#FC5701] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Mandatory Admin Verification Policy</p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Every submitted space initially receives a <span className="font-semibold text-amber-700">pending</span> status.
                  Our team reviews physical location accuracy and documentation before publishing to the public marketplace.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full shadow-md"
            >
              Submit Advertising Space for Admin Review
            </Button>
          </form>
        ) : (
          /* Submission Confirmation View */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
                Status: Pending Admin Review
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
                Space Submitted Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you! Your advertising space <span className="font-semibold text-slate-900">"{submittedListing.title}"</span> has been received and queued for admin review.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold">{submittedListing.locality}, {submittedListing.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rate:</span>
                <span className="font-semibold">₹{submittedListing.price.toLocaleString('en-IN')}/{submittedListing.pricingUnit?.replace('per_', '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification:</span>
                <span className="font-bold text-amber-600">Pending Review</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate('/saved-orders')}
              >
                View in Space History
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSubmittedListing(null);
                  setTitle('');
                  setDescription('');
                  setAddress('');
                  setPrice('');
                  setImagePreviews([]);
                  setSelectedFiles([]);
                }}
              >
                List Another Space
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
