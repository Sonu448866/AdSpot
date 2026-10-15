import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Adspot marketplace work?',
      a: 'Adspot connects advertisers looking for offline media exposure with verified property owners and media concessionaires who operate billboards, transit wraps, posters, and retail kiosks. Advertisers can browse spaces on an interactive map, compare transparent rates, book placement dates, and track campaigns.',
    },
    {
      q: 'How do I book an advertising space?',
      a: 'Simply browse our Explore Ads or Maps page, select your preferred advertising format and dates, review the transparent pricing breakdown, and proceed to checkout. Once your payment is verified by our server, the placement calendar is locked to prevent double-booking, and the space provider is notified.',
    },
    {
      q: 'How does space-owner verification work?',
      a: 'To maintain platform trust, every space submitted by an owner starts in a "pending" verification state. Our administration team inspects physical coordinates, mounting safety, lighting conditions, and pricing reasonableness before publishing the space to the public marketplace.',
    },
    {
      q: 'How do payments and invoices work?',
      a: 'Adspot integrates with Razorpay for secure payments. During checkout, we calculate a transparent breakdown: space rental charges + 5% platform service fee + 18% GST (plus an optional 15% managed service fee if chosen). An itemized digital receipt is generated immediately upon successful verification.',
    },
    {
      q: 'What is included in Adspot Managed Ads?',
      a: 'Adspot Managed Ads is an optional white-glove service. For an additional 15% coordination charge, our team assigns a dedicated campaign strategist to manage the entire workflow: vendor coordination, flex printing, mounting proof verification, and on-ground execution tracking.',
    },
    {
      q: 'How do Audience Location Insights and the Premium Heatmap work?',
      a: 'Our intelligence engine analyzes aggregated mobility, transit hubs, and commercial zones across Indian metropolitan areas. By providing your business category and target demographic, we suggest high-relevance corridors. You can also unlock high-resolution heatmap overlays using a 24-Hour Day Pass or 30-Day Pro subscription.',
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Cancellations requested 15 days or more before the campaign start date receive a 90% refund. Cancellations between 7 and 14 days receive a 50% refund. Cancellations requested less than 7 days prior cannot be refunded as space printing and physical scheduling have already been finalized.',
    },
    {
      q: 'How can I contact Adspot support?',
      a: 'You can submit an inquiry through our Contact Us page, email us at support@adspot.local, or reach out to our dedicated advertiser helpline during standard business hours.',
    },
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      <div className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#FC5701] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Support Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            Everything you need to know about booking, listing spaces, verification, and campaign management
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-[#FC5701] transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#FC5701]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-8 bg-orange-50/60 rounded-3xl border border-orange-200 text-center space-y-3">
          <h3 className="text-base font-bold text-slate-900">Have a specific campaign query?</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Our outdoor advertising consultants are ready to help you plan your regional rollout.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FC5701] text-white text-xs font-bold shadow-sm hover:bg-[#E04D00] transition"
          >
            <span>Contact Support Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
