import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-6">
            <span className="text-xs font-bold text-[#FC5701] uppercase tracking-wider">
              Legal & Data Protection
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last Updated: October 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When you use the Adspot marketplace, we collect necessary information required to
              facilitate advertising space discovery, bookings, and verified operator listings:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Account Information:</strong> Name, business entity name, email address,
                mobile phone number, and encrypted password credentials.
              </li>
              <li>
                <strong>Listing Information:</strong> For space owners, physical addresses, geographic
                coordinates, photos, and dimension specifications of advertising hoardings.
              </li>
              <li>
                <strong>Transactional Information:</strong> Payment identifiers, Razorpay order
                references, and booking schedules. We do not store raw credit card numbers or banking
                passwords on our servers.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. How We Use Your Information</h2>
            <p>We process collected data strictly for legitimate operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Facilitating reservation confirmations between advertisers and space providers.</li>
              <li>Preventing overlapping double-bookings on advertising calendars.</li>
              <li>Admin verification of outdoor hoarding authenticity.</li>
              <li>Sending transactional notifications regarding booking approvals and payments.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. Geographic & Mobility Data</h2>
            <p>
              Our Audience Location Insights and Heatmap features use aggregated, anonymized mobility
              indices and public urban planning records. We do not collect, monitor, or sell individual
              end-user GPS tracking traces.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">4. Data Sharing & Security</h2>
            <p>
              We do not sell personal user information to third-party data brokers. Data is shared
              only with authorized payment gateways (Razorpay) and Cloudinary media delivery networks
              solely to provide platform services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">5. Your Rights & Contact</h2>
            <p>
              Users may request access, updates, or deletion of their account records at any time by
              contacting privacy@adspot.local.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
