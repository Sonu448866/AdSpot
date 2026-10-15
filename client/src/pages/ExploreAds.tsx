import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Listing } from '../types';
import { useSaved } from '../context/SavedContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Heart,
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpDown,
  X,
  Building,
  Bus,
  FileText,
  Image as ImageIcon,
  Store,
  MonitorPlay,
} from 'lucide-react';

export const ExploreAds: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isSaved, toggleSave } = useSaved();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 12 });

  // Filters state from query params or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [lighting, setLighting] = useState(searchParams.get('lighting') || 'all');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Formats' },
    { id: 'billboard', label: 'Billboards & Hoardings' },
    { id: 'transit', label: 'Bus & Transit' },
    { id: 'pamphlet', label: 'Pamphlet Distribution' },
    { id: 'poster', label: 'Posters & Banners' },
    { id: 'retail', label: 'Retail & Spaces' },
    { id: 'digital_hoarding', label: 'Digital Screens' },
  ];

  const cities = ['all', 'Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad'];

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 12,
        sort,
      };

      if (search) params.search = search;
      if (category && category !== 'all') params.category = category;
      if (city && city !== 'all') params.city = city;
      if (locality) params.locality = locality;
      if (lighting && lighting !== 'all') params.lighting = lighting;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/listings', { params });
      setListings(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, page: 1, pages: 1, limit: 12 });
    } catch (err) {
      console.error('[ExploreAds Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category, city, locality, sort, minPrice, maxPrice, lighting, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchListings();
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory('all');
    setCity('all');
    setLocality('');
    setMinPrice('');
    setMaxPrice('');
    setLighting('all');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      {/* Top Header & Search Bar */}
      <div className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Explore Advertising Spaces
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Discover verified billboards, transit, posters, and flyers across prime locations
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                icon={<MapPin className="w-4 h-4 text-[#FC5701]" />}
                onClick={() => navigate('/maps')}
              >
                View on Map
              </Button>
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#FC5701]" />
                Filters
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by keywords, highway, landmark, or locality (e.g. Western Express Highway)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-[#FC5701] focus:ring-1 focus:ring-[#FC5701] outline-none transition"
              />
            </div>
            <Button type="submit" variant="primary" className="px-6">
              Search
            </Button>
          </form>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  category === cat.id
                    ? 'bg-[#FC5701] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Filter Sidebar (Desktop) */}
          <div
            className={`lg:block ${
              mobileFilterOpen
                ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto block'
                : 'hidden'
            } lg:relative lg:p-0 lg:bg-transparent lg:overflow-visible`}
          >
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 lg:hidden mb-4">
                <h3 className="font-bold text-slate-900">Filter Marketplace</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            )}

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FC5701]" />
                  Filters
                </h3>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#FC5701] hover:underline font-medium"
                >
                  Reset All
                </button>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#FC5701]"
                >
                  <option value="all">All Cities</option>
                  {cities
                    .filter((c) => c !== 'all')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>

              {/* Locality Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Locality / Area
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Andheri, Bandra..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#FC5701]"
                />
              </div>

              {/* Budget / Price Range */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Budget (INR)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#FC5701]"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#FC5701]"
                  />
                </div>
              </div>

              {/* Lighting */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Illumination Type
                </label>
                <select
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#FC5701]"
                >
                  <option value="all">Any Illumination</option>
                  <option value="front_lit">Front Lit</option>
                  <option value="back_lit">Back Lit</option>
                  <option value="digital_led">Digital LED</option>
                  <option value="non_lit">Non Lit</option>
                </select>
              </div>

              {mobileFilterOpen && (
                <Button
                  variant="primary"
                  className="w-full mt-4"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              )}
            </div>
          </div>

          {/* Right Listings Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sorting and Count Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-600">
                Showing{' '}
                <span className="text-slate-900 font-bold">{pagination.total}</span> approved
                advertising spaces
              </span>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-[#FC5701]"
                >
                  <option value="newest">Recently Added</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="impressions">Highest Reach / Impressions</option>
                </select>
              </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <EmptyState
                title="No Advertising Spaces Matched"
                description="We couldn't find any approved spaces matching your exact filters. Try adjusting your city, budget range, or clearing the search."
                actionLabel="Clear Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-card-hover hover:border-[#FC5701] transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Thumbnail & Badges */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <Badge variant="orange" size="sm" className="bg-white/95 backdrop-blur-xs capitalize shadow-xs">
                          {item.category.replace('_', ' ')}
                        </Badge>
                        <Badge variant="green" size="sm" className="bg-white/95 backdrop-blur-xs shadow-xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </Badge>
                      </div>

                      {/* Bookmark Save Button */}
                      <button
                        onClick={() => toggleSave(item)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition-all active:scale-90"
                        aria-label="Save listing"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isSaved(item._id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-slate-700'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Location */}
                        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mb-1">
                          <MapPin className="w-3.5 h-3.5 text-[#FC5701] shrink-0" />
                          <span className="truncate">
                            {item.locality}, {item.city}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#FC5701] transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        {/* Format & Dimensions */}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 pb-3 border-b border-slate-100">
                          <span>
                            {item.dimensions?.width}x{item.dimensions?.height} {item.dimensions?.unit}
                          </span>
                          <span>•</span>
                          <span className="capitalize">
                            {item.specifications?.lighting?.replace('_', ' ') || 'Illuminated'}
                          </span>
                          {item.audienceAttributes?.estimatedDailyImpressions && (
                            <>
                              <span>•</span>
                              <span>
                                {item.audienceAttributes.estimatedDailyImpressions.toLocaleString('en-IN')}{' '}
                                imp/day
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Rate</p>
                          <p className="text-base font-extrabold text-slate-950">
                            ₹{item.price.toLocaleString('en-IN')}
                            <span className="text-xs font-medium text-slate-500">
                              /{item.pricingUnit?.replace('per_', '')}
                            </span>
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/explore/${item._id}`)}
                          >
                            Details & Book
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-xs font-semibold text-slate-600 px-3">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
