import React from 'react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-6">
            <span className="text-xs font-bold text-[#FC5701] uppercase tracking-wider">
              Terms of Service
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Terms & Conditions
            </h1>
            <p className="text-xs text-slate-400 mt-1">Effective: October 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">1. Platform Nature</h2>
            <p>
              Adspot operates as a centralized technological marketplace connecting advertisers with
              owners and authorized operators of offline advertising spaces. Adspot provides
              discovery, reservation locking, payment verification, and optional campaign management.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. Space Provider Responsibilities</h2>
            <p>
              Space providers represent and warrant that they possess legitimate legal authority,
              municipal permits, and physical access rights to monetize listed advertising spaces.
              Providers must maintain the physical structural integrity and agreed illumination
              standards for all confirmed campaigns.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. Advertiser Responsibilities & Content</h2>
            <p>
              Advertisers are solely responsible for ensuring creative artwork complies with all
              applicable municipal advertising guidelines, consumer protection laws, and intellectual
              property standards. Defamatory, fraudulent, or illegal material will be rejected
              without refund.
            </p>
          </section>

          <section id="refunds" className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              4. Booking, Cancellations & Refund Policy
            </h2>
            <p>All confirmed reservations are subject to standardized cancellation terms:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>15+ days prior to start date:</strong> Eligible for 90% refund (10% platform
                processing deduction).
              </li>
              <li>
                <strong>7 to 14 days prior to start date:</strong> Eligible for 50% refund.
              </li>
              <li>
                <strong>Less than 7 days prior to start date:</strong> Non-refundable as space
                allocation and flex mounting schedules are locked.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">5. Managed Ads & Premium Services</h2>
            <p>
              Adspot Managed Ads is an optional 15% coordination fee service. While Adspot executes
              turnkey vendor management and mounting verification, Adspot does not guarantee specific
              conversion rates, click-throughs, or sales metrics from physical offline impressions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
