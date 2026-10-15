import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/assets/Adspot logo.png"
                alt="Adspot Logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Adspot is India's centralized marketplace for offline advertising spaces. We connect
              ambitious brands and local businesses with prime billboards, transit media, kiosks, and
              hyperlocal placement opportunities.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[#FC5701]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">100% Verified Inventory</p>
                <p className="text-[11px] text-slate-500">Every space inspected before live listing</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore" className="hover:text-white transition">
                  Explore All Spaces
                </Link>
              </li>
              <li>
                <Link to="/maps" className="hover:text-white transition">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link to="/list-your-space" className="text-[#FC5701] hover:underline font-medium">
                  List Your Space
                </Link>
              </li>
              <li>
                <Link to="/saved-orders" className="hover:text-white transition">
                  Saved & Previous Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">
                  Advertiser Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition">
                  About Adspot
                </a>
              </li>
              <li>
                <a href="#founders" className="hover:text-white transition">
                  Founding Team
                </a>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/terms#refunds" className="hover:text-white transition">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li className="pt-2 text-xs text-slate-500">
                Support: <span className="text-slate-300">support@adspot.local</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Founders Acknowledgement */}
        <div className="py-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FC5701]" />
            <span>
              Founded by <span className="text-slate-200 font-medium">Adithya Maurya</span>,{' '}
              <span className="text-slate-200 font-medium">Sonu Kumar</span>,{' '}
              <span className="text-slate-200 font-medium">Abhinav Patel</span>, and{' '}
              <span className="text-slate-200 font-medium">Nishchay Maurya</span>.
            </span>
          </div>
          <div>
            <span className="text-slate-500">Built with modern React, Express & MongoDB Atlas.</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} Adspot Technologies. All rights reserved.</p>
          <p>Every Space Has an Audience. Find Yours with Adspot.</p>
        </div>
      </div>
    </footer>
  );
};
