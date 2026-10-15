import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  User as UserIcon,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Bell,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  Layers,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [companyName, setCompanyName] = useState(user?.businessDetails?.companyName || '');
  const [businessAddress, setBusinessAddress] = useState(user?.businessDetails?.businessAddress || '');
  const [gstin, setGstin] = useState(user?.businessDetails?.gstin || '');

  const [emailNotif, setEmailNotif] = useState(user?.notificationPreferences?.email ?? true);
  const [smsNotif, setSmsNotif] = useState(user?.notificationPreferences?.sms ?? true);
  const [inAppNotif, setInAppNotif] = useState(user?.notificationPreferences?.inApp ?? true);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg(null);
      const res = await api.patch('/auth/profile', {
        name,
        phone,
        businessDetails: {
          companyName,
          businessAddress,
          gstin,
        },
        notificationPreferences: {
          email: emailNotif,
          sms: smsNotif,
          inApp: inAppNotif,
        },
      });

      updateUser(res.data.user);
      setSuccessMsg('Profile and settings updated successfully');
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleUpgrade = async (newRole: 'advertiser' | 'space_owner') => {
    try {
      setSaving(true);
      const res = await api.patch('/auth/profile', { role: newRole });
      updateUser(res.data.user);
      setSuccessMsg(`Account role successfully updated to ${newRole.replace('_', ' ')}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FC5701] to-amber-500 text-white flex items-center justify-center font-extrabold text-2xl uppercase shadow-md">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-950">{user?.name}</h1>
                  <Badge variant="orange" size="sm" className="capitalize">
                    {user?.role?.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="danger" size="sm" icon={<LogOut className="w-4 h-4" />} onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Quick Dashboards & Shortcuts */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Dashboard Quick Links</h3>

              <div className="space-y-2 text-xs">
                <Link
                  to="/saved-orders"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/50 hover:text-[#FC5701] font-semibold text-slate-700 transition"
                >
                  <span>Saved Spots & Bookings</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <Link
                  to="/list-your-space"
                  className="flex items-center justify-between p-3 rounded-2xl bg-orange-50/60 text-[#FC5701] font-semibold transition"
                >
                  <span className="flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4" /> List Another Advertising Space
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <Link
                  to="/maps"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/50 hover:text-[#FC5701] font-semibold text-slate-700 transition"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Audience Map & Insights
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Role Switcher / Capabilities */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Account Capabilities</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adspot accounts can both book advertising placements as an advertiser and monetize
                outdoor inventory as a space owner.
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleUpgrade('advertiser')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    user?.role === 'advertiser'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Advertiser Mode
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleUpgrade('space_owner')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    user?.role === 'space_owner'
                      ? 'bg-[#FC5701] text-white border-[#FC5701]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Space Owner Mode
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (2 cols): Profile & Account Settings Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleProfileSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Account & Business Profile</h3>
                  <p className="text-xs text-slate-500">Update your contact credentials and business entity information</p>
                </div>
                <Button type="submit" variant="primary" size="sm" loading={saving} icon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Personal Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                    />
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Business & Billing Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Company / Agency Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Outdoor Ltd"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="27AABCA1234C1Z5"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Registered Business Address
                    </label>
                    <input
                      type="text"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      placeholder="Office address, city, state and postal code"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-[#FC5701]"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Notification Channels
                </h4>

                <div className="space-y-2 text-xs text-slate-700">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotif}
                      onChange={(e) => setEmailNotif(e.target.checked)}
                      className="w-4 h-4 text-[#FC5701] rounded"
                    />
                    <span>Email updates for booking confirmations and verification results</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inAppNotif}
                      onChange={(e) => setInAppNotif(e.target.checked)}
                      className="w-4 h-4 text-[#FC5701] rounded"
                    />
                    <span>In-app alerts on status changes and campaigns</span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
