import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../services/api';
import { MapMarker as IMapMarker, AudienceZone } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  Compass,
  MapPin,
  Heart,
  SlidersHorizontal,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  Search,
} from 'lucide-react';

// Fix Leaflet marker icons in React
const createPinIcon = (color: 'green' | 'red' | 'amber') => {
  const hex = color === 'green' ? '#10B981' : color === 'red' ? '#EF4444' : '#F59E0B';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
    <path fill="${hex}" stroke="#ffffff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="3.5" fill="#ffffff"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-map-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Component to dynamically re-center Leaflet map
const ChangeMapView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const InteractiveMaps: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { isSaved, toggleSave } = useSaved();

  const [markers, setMarkers] = useState<IMapMarker[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [city, setCity] = useState('Mumbai');
  const [category, setCategory] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState<IMapMarker | null>(null);

  // Audience Insights state
  const [insightsActive, setInsightsActive] = useState(true);
  const [businessCategory, setBusinessCategory] = useState('Education / Coaching');
  const [targetAudience, setTargetAudience] = useState('College Students');
  const [recommendations, setRecommendations] = useState<AudienceZone[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Premium Heatmap state
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [isHeatmapUnlocked, setIsHeatmapUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  // Center coordinates
  const cityCenters: Record<string, [number, number]> = {
    Mumbai: [19.0760, 72.8777],
    Delhi: [28.6139, 77.2090],
    Bengaluru: [12.9716, 77.5946],
  };

  const mapCenter = cityCenters[city] || [19.0760, 72.8777];

  // Fetch Markers
  const fetchMapListings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/maps/listings', {
        params: { city, category: category !== 'all' ? category : undefined },
      });
      setMarkers(res.data.data || []);
    } catch (err) {
      console.error('[Map Listings Error]', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Insights
  const fetchInsights = async () => {
    try {
      setInsightsLoading(true);
      const res = await api.get('/maps/insights', {
        params: {
          city,
          businessCategory,
          targetAudience,
        },
      });
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error('[Insights Error]', err);
    } finally {
      setInsightsLoading(false);
    }
  };

  // Fetch Heatmap Data & Check Entitlement
  const fetchHeatmapData = async () => {
    try {
      const res = await api.get('/maps/heatmap', {
        params: { city },
      });
      setIsHeatmapUnlocked(res.data.isUnlocked || false);
      setHeatmapData(res.data.data || res.data.previewData || []);
    } catch (err) {
      console.error('[Heatmap Error]', err);
    }
  };

  useEffect(() => {
    fetchMapListings();
    fetchInsights();
    fetchHeatmapData();
  }, [city, category]);

  const handleToggleHeatmap = () => {
    if (!heatmapEnabled) {
      if (!isHeatmapUnlocked && user?.role !== 'admin') {
        setShowUnlockModal(true);
        return;
      }
      setHeatmapEnabled(true);
    } else {
      setHeatmapEnabled(false);
    }
  };

  // Purchase temporary 24-hour unlock pass
  const handlePurchaseUnlock = async (entitlementType: string) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    try {
      setUnlockLoading(true);
      // 1. Create order
      const orderRes = await api.post('/payments/create-order', {
        entitlementType,
      });

      const { order } = orderRes.data;

      // 2. Verify payment server-side
      await api.post('/payments/verify', {
        razorpayOrderId: order.id,
        razorpayPaymentId: `pay_unlock_${Date.now()}`,
        razorpaySignature: 'simulated_verified_unlock',
      });

      setIsHeatmapUnlocked(true);
      setHeatmapEnabled(true);
      setShowUnlockModal(false);
      await fetchHeatmapData();
    } catch (err: any) {
      console.error('[Unlock Error]', err);
      alert(err.message || 'Payment failed');
    } finally {
      setUnlockLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Top Filter Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-4 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-[#FC5701]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">Interactive Advertising Map</h1>
              <p className="text-[11px] text-slate-500">
                Explore verified locations and audience mobility hotspots
              </p>
            </div>
          </div>

          {/* City & Category Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#FC5701]"
            >
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#FC5701]"
            >
              <option value="all">All Advertising Categories</option>
              <option value="billboard">Billboards & Hoardings</option>
              <option value="transit">Bus & Transit</option>
              <option value="pamphlet">Pamphlets</option>
              <option value="poster">Posters & Banners</option>
              <option value="digital_hoarding">Digital LED Screens</option>
            </select>

            {/* Heatmap Toggle Button */}
            <button
              onClick={handleToggleHeatmap}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                heatmapEnabled
                  ? 'bg-[#FC5701] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Audience Heatmap</span>
              {isHeatmapUnlocked ? (
                <Unlock className="w-3 h-3 text-emerald-300" />
              ) : (
                <Lock className="w-3 h-3 text-amber-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Map + Insights Split View */}
      <div className="flex-1 relative flex flex-col lg:flex-row h-[calc(100vh-145px)] overflow-hidden">
        {/* Map View Area */}
        <div className="flex-1 relative h-full">
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <ChangeMapView center={mapCenter} zoom={12} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Heatmap Layer Simulation Circles */}
            {heatmapEnabled &&
              heatmapData.map((pt, idx) => (
                <Circle
                  key={`heat_${idx}`}
                  center={[pt.lat, pt.lng]}
                  radius={isHeatmapUnlocked ? 1200 : 700}
                  pathOptions={{
                    fillColor: '#FC5701',
                    fillOpacity: pt.intensity * 0.45,
                    color: '#FD5801',
                    weight: 1,
                    opacity: 0.6,
                  }}
                />
              ))}

            {/* Space Markers */}
            {markers.map((marker) => {
              const lat = marker.coordinates[1];
              const lng = marker.coordinates[0];
              const icon = createPinIcon(marker.statusColor);

              return (
                <Marker
                  key={marker.id}
                  position={[lat, lng]}
                  icon={icon}
                  eventHandlers={{
                    click: () => setSelectedMarker(marker),
                  }}
                >
                  <Popup className="adspot-leaflet-popup">
                    <div className="p-1 max-w-[260px] space-y-2">
                      <img
                        src={marker.thumbnail}
                        alt={marker.title}
                        className="w-full h-28 object-cover rounded-xl"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#FC5701] uppercase">
                            {marker.category.replace('_', ' ')}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              marker.statusColor === 'green'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {marker.statusLabel}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                          {marker.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {marker.locality}, {marker.city}
                        </p>
                        <p className="text-xs font-extrabold text-slate-950 pt-1">
                          ₹{marker.price.toLocaleString('en-IN')}/{marker.pricingUnit.replace('per_', '')}
                        </p>
                      </div>
                      <div className="pt-2 flex gap-1.5">
                        <button
                          onClick={() => navigate(`/explore/${marker.id}`)}
                          className="flex-1 py-1.5 bg-[#FC5701] hover:bg-[#E04D00] text-white text-[11px] font-semibold rounded-lg text-center transition"
                        >
                          View & Book
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Status Legend Overlay */}
          <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl shadow-lg border border-slate-200 text-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Map Status
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                <span className="text-slate-700 font-medium">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                <span className="text-slate-700 font-medium">Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                <span className="text-slate-700 font-medium">Pending</span>
              </div>
            </div>
            {heatmapEnabled && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Mobility Intensity:</span>
                <span className="font-bold text-[#FC5701]">Heat Gradient Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Audience-Location Insights Side Panel */}
        <div className="w-full lg:w-[420px] xl:w-[460px] bg-white border-l border-slate-200/80 flex flex-col h-full overflow-hidden shadow-lg z-20">
          {/* Panel Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#FC5701]" />
              <h2 className="text-sm font-bold text-slate-900">
                Where Can You Find Your Customers?
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Provide your business category and audience profile to discover verified high-density corridors.
            </p>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                  Business Category
                </label>
                <input
                  type="text"
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  placeholder="e.g. Coaching, Fashion..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                  Target Demographic
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Students, Techies..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full mt-3"
              onClick={fetchInsights}
              loading={insightsLoading}
            >
              Analyze Hotspots
            </Button>
          </div>

          {/* Recommendations List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Suggested Advertising Zones in {city}
            </span>

            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No audience zones found. Try adjusting your category or target audience.
              </div>
            ) : (
              recommendations.map((zone) => (
                <div
                  key={zone.id}
                  className="p-4 bg-slate-50 hover:bg-orange-50/40 rounded-2xl border border-slate-200/80 hover:border-[#FC5701] transition-all space-y-2 cursor-pointer"
                  onClick={() => {
                    navigate(`/explore?city=${city}&locality=${zone.locality}`);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">{zone.locality}</h3>
                    <span className="text-[11px] font-extrabold text-[#FC5701] bg-orange-100 px-2 py-0.5 rounded-full">
                      {zone.relevanceScore}% Match
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    {zone.recommendationReason}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {zone.primaryLandmarks.slice(0, 3).map((lm, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {lm}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-[#FC5701]">
                    <span>Inspect available spaces</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Premium Heatmap Unlock Modal */}
      <Modal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        maxWidth="md"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-100 text-[#FC5701] flex items-center justify-center">
            <Layers className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">Unlock Audience Heatmap Layer</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            Get high-resolution footfall intensity overlays, transit density circles, and demographic
            mobility concentrations across all major junctions.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">24-Hour Pass</span>
              <p className="text-xl font-extrabold text-slate-900">₹499</p>
              <p className="text-[11px] text-slate-500">Perfect for planning a single upcoming campaign</p>
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2"
                loading={unlockLoading}
                onClick={() => handlePurchaseUnlock('audience_heatmap_24h')}
              >
                Unlock for 24h
              </Button>
            </div>

            <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl text-left space-y-2 relative">
              <span className="absolute -top-2.5 right-3 bg-[#FC5701] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                Best Value
              </span>
              <span className="text-[10px] font-bold text-[#FC5701] uppercase">30-Day Pro</span>
              <p className="text-xl font-extrabold text-slate-900">₹2,999</p>
              <p className="text-[11px] text-slate-500">Unlimited heatmap access across all Indian metros</p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full mt-2"
                loading={unlockLoading}
                onClick={() => handlePurchaseUnlock('audience_heatmap_monthly')}
              >
                Unlock Pro Access
              </Button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400">
            Backed by Razorpay test gateway • Instant activation enforced on backend
          </p>
        </div>
      </Modal>
    </div>
  );
};
