import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from './Button';
import {
  Menu,
  X,
  Bell,
  Heart,
  User as UserIcon,
  PlusCircle,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  Compass,
  CheckCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Ads', path: '/explore' },
    { label: 'Maps', path: '/maps' },
    { label: 'Saved & Orders', path: '/saved-orders' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleProtectedClick = (e: React.MouseEvent, path: string) => {
    if (!isAuthenticated && path === '/saved-orders') {
      e.preventDefault();
      openAuthModal('login');
    }
  };

  const handleListSpaceClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/list-your-space');
      openAuthModal('login', 'space_owner');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/Adspot logo.png"
              alt="Adspot Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleProtectedClick(e, link.path)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-[#FC5701] bg-orange-50/60 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center gap-3">
            {/* "List Your Space" Button */}
            <Link to="/list-your-space" onClick={handleListSpaceClick}>
              <Button
                variant="outline"
                size="sm"
                icon={<PlusCircle className="w-4 h-4 text-[#FC5701]" />}
                className="border-orange-200 text-slate-800 hover:bg-orange-50/40"
              >
                List Your Space
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Notification Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#FC5701] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAsRead('all')}
                            className="text-xs text-[#FC5701] hover:underline flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n._id}
                              onClick={() => markAsRead(n._id)}
                              className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition ${
                                !n.read ? 'bg-orange-50/30' : ''
                              }`}
                            >
                              <p className="text-xs font-bold text-slate-900">{n.title}</p>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar & Menu (Shown when logged in) */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition ${
                      profileDropdownOpen
                        ? 'bg-orange-50/80 border-[#FC5701] text-[#FC5701]'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                    title="View Profile & Settings"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FC5701] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-800 max-w-[95px] truncate leading-tight">
                        {user?.name?.split(' ')[0] || 'Profile'}
                      </span>
                      <span className="text-[9px] font-medium text-slate-500 capitalize leading-tight">
                        {user?.role?.replace('_', ' ')}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        profileDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-orange-100/70 text-[#FC5701] text-[10px] font-bold rounded-full capitalize">
                            {user?.role?.replace('_', ' ')}
                          </span>
                          {user?.role === 'space_owner' && (
                            <span className="text-[10px] text-emerald-600 font-medium">
                              ● Space Owner
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          My Profile & Settings
                        </Link>
                        <Link
                          to="/saved-orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Heart className="w-4 h-4 text-slate-400" />
                          Saved & Orders
                        </Link>
                        {user?.role === 'space_owner' && (
                          <Link
                            to="/list-your-space"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                          >
                            <PlusCircle className="w-4 h-4 text-slate-400" />
                            List New Space
                          </Link>
                        )}
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#FC5701] hover:bg-orange-50 transition"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Explicit Log Out Button in Desktop Header */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setNotifDropdownOpen(false);
                    logout();
                  }}
                  icon={<LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-600 transition" />}
                  className="group text-slate-600 hover:text-red-600 hover:bg-red-50/80 border border-slate-200/60 hover:border-red-200 text-xs px-2.5 py-1.5 rounded-xl transition font-medium flex items-center gap-1.5"
                  title="Log Out"
                >
                  <span className="hidden lg:inline">Log Out</span>
                </Button>
              </div>
            ) : (
              /* When not logged in: Unified Sign In / Register button */
              <Button
                variant="primary"
                size="sm"
                onClick={() => openAuthModal('login')}
                icon={<UserIcon className="w-4 h-4" />}
                className="shadow-sm font-semibold"
              >
                Sign In / Register
              </Button>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => navigate('/profile')}
                className="w-8 h-8 rounded-full bg-[#FC5701] text-white flex items-center justify-center font-bold text-xs"
                title="Go to Profile"
              >
                {user?.name?.charAt(0) || 'U'}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {isAuthenticated && (
            <div className="p-3 mb-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FC5701] text-white flex items-center justify-center font-bold text-sm uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[160px]">{user?.email}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-orange-100/80 text-[#FC5701] text-[10px] font-bold rounded-full capitalize">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-[#FC5701] hover:underline px-2 py-1"
              >
                Profile →
              </Link>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={(e) => {
                handleProtectedClick(e, link.path);
                setMobileMenuOpen(false);
              }}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-orange-50 text-[#FC5701] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              My Profile & Settings
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link
              to="/list-your-space"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleListSpaceClick(e);
              }}
              className="block"
            >
              <Button variant="outline" className="w-full justify-center">
                List Your Space
              </Button>
            </Link>
            {!isAuthenticated ? (
              <Button
                variant="primary"
                className="w-full justify-center"
                icon={<UserIcon className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
              >
                Sign In / Register
              </Button>
            ) : (
              <Button
                variant="danger"
                className="w-full justify-center"
                icon={<LogOut className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                Log Out
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
