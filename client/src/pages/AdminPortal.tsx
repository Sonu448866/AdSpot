import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  LayoutDashboard,
  ShieldCheck,
  Building,
  Users,
  Calendar,
  Sparkles,
  MessageSquare,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  LogOut,
  RefreshCw,
  Search,
  SlidersHorizontal,
  DollarSign,
  Layers,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'listings' | 'users' | 'bookings' | 'campaigns' | 'enquiries' | 'audit_logs'
  >('overview');

  // Overview stats & charts
  const [overview, setOverview] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Listings state
  const [listings, setListings] = useState<any[]>([]);
  const [listingFilter, setListingFilter] = useState('all');
  const [listingsLoading, setListingsLoading] = useState(false);

  // Inspect / Reject modal
  const [inspectListing, setInspectListing] = useState<any | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Bookings state
  const [bookings, setBookings] = useState<any[]>([]);

  // Campaigns state
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [enquiryNotes, setEnquiryNotes] = useState('');

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Enforce admin auth
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const fetchOverview = async () => {
    try {
      setOverviewLoading(true);
      const res = await api.get('/admin/overview');
      setOverview(res.data);
    } catch (err) {
      console.error('[Admin Overview Error]', err);
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      setListingsLoading(true);
      const res = await api.get('/admin/listings', {
        params: { status: listingFilter !== 'all' ? listingFilter : undefined },
      });
      setListings(res.data.data || []);
    } catch (err) {
      console.error('[Admin Listings Error]', err);
    } finally {
      setListingsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users', {
        params: { role: userRoleFilter !== 'all' ? userRoleFilter : undefined },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('[Admin Users Error]', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      console.error('[Admin Bookings Error]', err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/admin/campaigns');
      setCampaigns(res.data.data || []);
    } catch (err) {
      console.error('[Admin Campaigns Error]', err);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await api.get('/admin/enquiries');
      setEnquiries(res.data.data || []);
    } catch (err) {
      console.error('[Admin Enquiries Error]', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs');
      setAuditLogs(res.data.data || []);
    } catch (err) {
      console.error('[Admin Logs Error]', err);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    if (activeTab === 'overview') fetchOverview();
    else if (activeTab === 'listings') fetchListings();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'bookings') fetchBookings();
    else if (activeTab === 'campaigns') fetchCampaigns();
    else if (activeTab === 'enquiries') fetchEnquiries();
    else if (activeTab === 'audit_logs') fetchAuditLogs();
  }, [activeTab, listingFilter, userRoleFilter]);

  // Handle Listing Approval
  const handleApproveListing = async (listingId: string) => {
    try {
      setActionLoading(true);
      await api.patch(`/admin/listings/${listingId}/verification`, {
        status: 'approved',
      });
      setInspectListing(null);
      await fetchListings();
      await fetchOverview();
    } catch (err: any) {
      alert(err.message || 'Error approving listing');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Listing Rejection
  const handleRejectListing = async () => {
    if (!inspectListing) return;
    try {
      setActionLoading(true);
      await api.patch(`/admin/listings/${inspectListing._id}/verification`, {
        status: 'rejected',
        rejectionReason: rejectReason,
        adminNotes,
      });
      setRejectModalOpen(false);
      setInspectListing(null);
      setRejectReason('');
      setAdminNotes('');
      await fetchListings();
      await fetchOverview();
    } catch (err: any) {
      alert(err.message || 'Error rejecting listing');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle User Status
  const handleToggleUser = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: nextStatus });
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update Campaign Status
  const handleUpdateCampaignStatus = async (campaignId: string, status: string) => {
    try {
      await api.patch(`/admin/campaigns/${campaignId}/status`, {
        operationalStatus: status,
        note: `Status updated by ${user?.name}`,
      });
      fetchCampaigns();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update Enquiry Status
  const handleUpdateEnquiry = async (status: string) => {
    if (!selectedEnquiry) return;
    try {
      await api.patch(`/admin/enquiries/${selectedEnquiry._id}`, {
        status,
        internalNotes: enquiryNotes,
      });
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const COLORS = ['#FC5701', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FC5701] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-wider uppercase text-white flex items-center gap-2">
              Adspot Admin Portal
              <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full font-mono">
                SECURE CONSOLE
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">
            Logged in as: <strong className="text-white">{user?.name}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
          >
            Public Site
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={logout}
            icon={<LogOut className="w-3.5 h-3.5" />}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 space-y-1 shrink-0">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'listings', label: 'Listings Review', icon: <Building className="w-4 h-4" /> },
            { id: 'users', label: 'User Accounts', icon: <Users className="w-4 h-4" /> },
            { id: 'bookings', label: 'Bookings & Orders', icon: <Calendar className="w-4 h-4" /> },
            { id: 'campaigns', label: 'Managed Campaigns', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'enquiries', label: 'Contact Enquiries', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'audit_logs', label: 'Audit Trail', icon: <FileText className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === item.id
                  ? 'bg-[#FC5701] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* ========================================================
              TAB 1: OVERVIEW DASHBOARD (Real DB Queries & Recharts)
             ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">System Overview & Metrics</h2>
                  <p className="text-xs text-slate-400">
                    Live database statistics aggregated directly from MongoDB Atlas
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                  onClick={fetchOverview}
                  className="border-slate-800 text-slate-300"
                >
                  Refresh
                </Button>
              </div>

              {overviewLoading || !overview ? (
                <div className="p-12 text-center text-xs text-slate-500">Loading metrics...</div>
              ) : (
                <>
                  {/* KPI Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-400">Total Users</p>
                      <p className="text-2xl font-extrabold text-white mt-1">
                        {overview.stats.totalUsers}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {overview.stats.totalAdvertisers} Advertisers • {overview.stats.totalSpaceOwners} Owners
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-400">Pending Review</p>
                      <p className="text-2xl font-extrabold text-amber-500 mt-1">
                        {overview.stats.pendingListings}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">Requires admin verification</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-400">Approved Spaces Live</p>
                      <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                        {overview.stats.approvedListings}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">Available in marketplace</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-400">Captured Revenue</p>
                      <p className="text-2xl font-extrabold text-[#FC5701] mt-1">
                        ₹{overview.stats.totalRevenue.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {overview.stats.activeBookings + overview.stats.completedBookings} Confirmed Orders
                      </p>
                    </div>
                  </div>

                  {/* Recharts Visualizations */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Category Distribution */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                        Inventory by Advertising Category
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={overview.charts.categoryDistribution}>
                            <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                            />
                            <Bar dataKey="count" fill="#FC5701" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Verification Status Distribution */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                        Listing Verification Distribution
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={overview.charts.statusDistribution}
                              dataKey="count"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={(entry: any) => `${entry.name}: ${entry.value || entry.count}`}
                            >
                              {overview.charts.statusDistribution.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 2: LISTINGS REVIEW & VERIFICATION
             ======================================================== */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Space Verification Management</h2>
                  <p className="text-xs text-slate-400">
                    Review submitted outdoor advertising spaces before approving for public display
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={listingFilter}
                    onChange={(e) => setListingFilter(e.target.value)}
                    className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Review Only</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {listingsLoading ? (
                <div className="p-12 text-center text-xs text-slate-500">Loading listings...</div>
              ) : listings.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
                  No listings found for the selected filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {listings.map((item) => (
                    <div
                      key={item._id}
                      className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.verificationStatus === 'approved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : item.verificationStatus === 'pending'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-red-950 text-red-400 border border-red-800'
                            }`}
                          >
                            {item.verificationStatus.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {item.locality}, {item.city} • Rate: ₹{item.price.toLocaleString('en-IN')}/{item.pricingUnit?.replace('per_', '')}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Submitted by:{' '}
                          <span className="text-slate-300 font-medium">
                            {item.owner?.businessDetails?.companyName || item.owner?.name} ({item.owner?.email})
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => setInspectListing(item)}
                          className="border-slate-700 text-slate-300 text-xs"
                        >
                          Review & Action
                        </Button>

                        {item.verificationStatus === 'pending' && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                              onClick={() => handleApproveListing(item._id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              icon={<XCircle className="w-3.5 h-3.5" />}
                              onClick={() => {
                                setInspectListing(item);
                                setRejectModalOpen(true);
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 3: USER MANAGEMENT
             ======================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Registered Accounts</h2>
                  <p className="text-xs text-slate-400">
                    Manage advertisers, space owners, and access controls
                  </p>
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="advertiser">Advertisers</option>
                  <option value="space_owner">Space Owners</option>
                </select>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="divide-y divide-slate-800 text-xs">
                  {users.map((u) => (
                    <div key={u._id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{u.name}</p>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full capitalize">
                            {u.role.replace('_', ' ')}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              u.status === 'active'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-red-950 text-red-400'
                            }`}
                          >
                            {u.status}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-0.5">{u.email} • Phone: {u.phone || 'N/A'}</p>
                        {u.businessDetails?.companyName && (
                          <p className="text-slate-500 text-[11px]">
                            Company: {u.businessDetails.companyName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Button
                          variant={u.status === 'active' ? 'danger' : 'outline'}
                          size="sm"
                          onClick={() => handleToggleUser(u._id, u.status)}
                          className="text-xs"
                        >
                          {u.status === 'active' ? 'Suspend Account' : 'Reactivate'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: BOOKINGS & ORDERS
             ======================================================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">All Platform Bookings</h2>

              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{b.bookingReference}</span>
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full uppercase">
                          {b.bookingStatus}
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium">{b.listing?.title}</p>
                      <p className="text-slate-500">
                        Advertiser: {b.advertiser?.name} ({b.advertiser?.email}) • Provider:{' '}
                        {b.provider?.name}
                      </p>
                      <p className="text-slate-400">
                        Dates: {new Date(b.startDate).toLocaleDateString()} -{' '}
                        {new Date(b.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-extrabold text-[#FC5701]">
                        ₹{b.pricing?.totalAmount?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-emerald-400">Payment: {b.paymentStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: MANAGED CAMPAIGNS
             ======================================================== */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Managed Ads Strategy Desk</h2>

              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">No managed campaigns yet.</div>
                ) : (
                  campaigns.map((c) => (
                    <div
                      key={c._id}
                      className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-[#FC5701]">{c.campaignReference}</span>
                          <h4 className="text-sm font-bold text-white mt-1">Objective: {c.objective}</h4>
                          <p className="text-xs text-slate-400">
                            Advertiser: {c.advertiser?.name} • Budget: ₹{c.budget?.toLocaleString('en-IN')}
                          </p>
                        </div>

                        <select
                          value={c.operationalStatus}
                          onChange={(e) => handleUpdateCampaignStatus(c._id, e.target.value)}
                          className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="strategy_planning">Strategy Planning</option>
                          <option value="vendor_coordination">Vendor Coordination</option>
                          <option value="in_execution">In Execution</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300">
                        <strong className="text-slate-400 block mb-1">Campaign Brief:</strong>
                        {c.campaignBrief}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: CONTACT ENQUIRIES
             ======================================================== */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Customer Support Inquiries</h2>

              <div className="space-y-3">
                {enquiries.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">No inquiries recorded.</div>
                ) : (
                  enquiries.map((enq) => (
                    <div
                      key={enq._id}
                      className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{enq.subject}</h4>
                          <p className="text-xs text-slate-400">
                            From: {enq.name} ({enq.email}) • Phone: {enq.phone || 'N/A'}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            enq.status === 'resolved'
                              ? 'bg-emerald-950 text-emerald-400'
                              : 'bg-amber-950 text-amber-400'
                          }`}
                        >
                          {enq.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl">
                        {enq.message}
                      </p>

                      <div className="pt-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-700 text-xs text-emerald-400"
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            handleUpdateEnquiry('resolved');
                          }}
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 7: AUDIT LOGS
             ======================================================== */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Administrative Audit Trail</h2>

              <div className="space-y-2 text-xs">
                {auditLogs.map((log) => (
                  <div
                    key={log._id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#FC5701]">{log.action}</span>
                      <p className="text-slate-400 mt-0.5">
                        Target: {log.targetRecordType} ({log.targetRecordId})
                      </p>
                    </div>
                    <div className="text-right text-slate-500">
                      <p>{log.admin?.name || 'Administrator'}</p>
                      <p className="text-[10px]">{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Inspect Space Modal */}
      <Modal
        isOpen={!!inspectListing && !rejectModalOpen}
        onClose={() => setInspectListing(null)}
        maxWidth="lg"
        title="Inspect Advertising Space"
      >
        {inspectListing && (
          <div className="space-y-4 text-xs text-slate-800">
            <img
              src={inspectListing.images?.[0]?.url}
              alt=""
              className="w-full h-48 object-cover rounded-xl"
            />
            <h3 className="text-base font-bold text-slate-900">{inspectListing.title}</h3>
            <p className="text-slate-600">{inspectListing.description}</p>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p>
                <strong>City:</strong> {inspectListing.city}
              </p>
              <p>
                <strong>Locality:</strong> {inspectListing.locality}
              </p>
              <p>
                <strong>Rate:</strong> ₹{inspectListing.price.toLocaleString('en-IN')}/
                {inspectListing.pricingUnit}
              </p>
              <p>
                <strong>Dimensions:</strong> {inspectListing.dimensions?.width}x
                {inspectListing.dimensions?.height} {inspectListing.dimensions?.unit}
              </p>
            </div>

            <div className="flex gap-3 pt-3">
              <Button
                variant="primary"
                className="flex-1"
                loading={actionLoading}
                onClick={() => handleApproveListing(inspectListing._id)}
              >
                Approve & Publish Live
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => setRejectModalOpen(true)}
              >
                Reject Space
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Rejection Modal with Reason */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        maxWidth="md"
        title="Reject Advertising Space"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Provide the rejection reason so the space owner receives clear actionable feedback to
            correct the submission.
          </p>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Rejection Reason *
            </label>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Dimensions not clearly visible in photograph, rate exceeds standard municipal bounds..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Internal Admin Notes
            </label>
            <input
              type="text"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Private notes for auditing..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <Button
            variant="danger"
            className="w-full"
            loading={actionLoading}
            onClick={handleRejectListing}
          >
            Confirm Rejection & Notify Owner
          </Button>
        </div>
      </Modal>
    </div>
  );
};
