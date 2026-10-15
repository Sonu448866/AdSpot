import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import {
  Compass,
  MapPin,
  PlusCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Layers,
  Search,
  Sparkles,
  ShieldCheck,
  Building,
  Bus,
  FileText,
  Image as ImageIcon,
  Store,
  MonitorPlay,
  Users,
  Target,
  BarChart3,
  Check,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const formats = [
    {
      id: 'billboard',
      title: 'Billboards & Hoardings',
      desc: 'Prime unipoles, gantries, and rooftop boards along high-density highways.',
      icon: <Building className="w-6 h-6 text-[#FC5701]" />,
      image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'transit',
      title: 'Bus & Transit Advertising',
      desc: 'Full bus wraps, metro train interiors, and auto-rickshaw branding.',
      icon: <Bus className="w-6 h-6 text-[#FC5701]" />,
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'pamphlet',
      title: 'Pamphlet Distribution',
      desc: 'Verified door-to-door drops and newspaper inserts in targeted residential societies.',
      icon: <FileText className="w-6 h-6 text-[#FC5701]" />,
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'poster',
      title: 'Posters & Banners',
      desc: 'High-frequency street banners, pillar postings, and retail market displays.',
      icon: <ImageIcon className="w-6 h-6 text-[#FC5701]" />,
      image: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'retail',
      title: 'Retail & Commercial Spaces',
      desc: 'Mall standees, supermarket floor graphics, and boutique storefront placements.',
      icon: <Store className="w-6 h-6 text-[#FC5701]" />,
      image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'digital_hoarding',
      title: 'Digital DOOH Screens',
      desc: 'Dynamic high-definition P4 LED screens at prominent commercial intersections.',
      icon: <MonitorPlay className="w-6 h-6 text-[#FC5701]" />,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const founders = [
    { name: 'Adithya Maurya', role: 'CEO & Co-Founder ', img: 'AM' },
    { name: 'Sonu Kumar', role: 'Co-Founder & Operations Lead', img: 'SK' },
    { name: 'Abhinav Patel', role: 'Co-Founder & Tech lead', img: 'AP' },
    { name: 'Nishchay Maurya', role: 'Co-Founder & Sales Lead', img: 'NM' },
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-900 overflow-hidden">
      {/* ========================================================
          A. HERO SECTION
         ======================================================== */}
      <section className="relative pt-12 pb-12 lg:pt-12 lg:pb-12 bg-radial-gradient"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/70 border border-orange-200 text-[#FC5701] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                The Offline Advertising Marketplace
              </div>
        
              {/* Bold Editorial Headline */}
              <div className="space-y-3 relative">
                <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[0.98] uppercase font-serif">
                  Every Space <br />
                  <span className="italic font-small text-4xl text-slate-800">Has An</span> Audience.{' '}
                  <span className="block mt-2 text-[#FC5701] text-7xl font-sans font-black tracking-tighter not-italic relative inline-block bg-slate-950 text-white px-3 py-1 transform -rotate-1 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(252,87,1,1)]">
                    Find Yours with Adspot.
                  </span>
                </h1>
              </div>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Discover, compare, and book offline advertising spaces in one place. Find the right
                locations, understand your potential audience, and turn physical advertising into
                smarter campaigns.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 ">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Compass className="w-5 h-5" />}
                  onClick={() => navigate('/explore')}
                >
                  Explore Ads
                </Button>
                <Button
                  variant="outline" 
                  size="lg"
                  icon={<MapPin className="w-5 h-5 text-[#FC5701]" />}
                  onClick={() => navigate('/maps')}
                >
                  Explore Map
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  icon={<PlusCircle className="w-5 h-5 text-slate-500" />}
                  onClick={() => navigate('/list-your-space')}
                >
                  List Your Space
                </Button>
              </div>
            </motion.div>

            {/* Right Hero Mascot & Visual Showcase */}
            <div
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Decorative background glow */}
                <div className="absolute -inset-4  from-orange-400/20 to-amber-300/20 rounded-3xl blur-2xl -z-10" />

                    {/* Hero Mascot */}
                  <div className="w-full flex justify-center mb-4">
                    <img
                      src="/assets/Adspot_Mascoot.png"
                      alt="Adspot Mascot"
                      className="h-80 sm:h-96 mb-24 object-contain filter drop-shadow-lg"
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          B. HOW ADSPOT WORKS
         ======================================================== */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#FC5701] uppercase tracking-widest block mb-2">
              End-to-End Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Adspot Works
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Whether you are an advertiser launching a local campaign or a property owner monetizing
              outdoor walls, Adspot simplifies the entire lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Advertiser Journey */}
            <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-100 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FC5701] flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Advertisers</h3>
                  <p className="text-xs text-slate-500">Discover and book verified outdoor spaces</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: '01',
                    title: 'Discover Advertising Opportunities',
                    desc: 'Search billboards, transit wraps, and flyers by city, category, and budget.',
                  },
                  {
                    step: '02',
                    title: 'Compare Pricing & Placements',
                    desc: 'Inspect dimensions, lighting, clearance angles, and rate units with transparent breakdown.',
                  },
                  {
                    step: '03',
                    title: 'Identify Target Audience Zones',
                    desc: 'Use interactive maps and audience suggestions to choose spots with high demographic relevance.',
                  },
                  {
                    step: '04',
                    title: 'Book Directly or Choose Managed Ads',
                    desc: 'Lock in dates with verified payments or opt for full campaign coordination by Adspot.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 text-[#FC5701] text-xs font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Space Owner Journey */}
            <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-100 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Space Owners</h3>
                  <p className="text-xs text-slate-500">Monetize physical real estate and media rights</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: '01',
                    title: 'Register Your Profile',
                    desc: 'Create an account with your business details and contact credentials.',
                  },
                  {
                    step: '02',
                    title: 'Submit Space Details & Photos',
                    desc: 'Provide hoarding dimensions, address, coordinates, and high-resolution photographs.',
                  },
                  {
                    step: '03',
                    title: 'Admin Verification Review',
                    desc: 'Our quality team reviews your listing to verify physical authenticity and pricing accuracy.',
                  },
                  {
                    step: '04',
                    title: 'Receive & Manage Bookings',
                    desc: 'Approved spaces go live in the marketplace to receive verified advertiser reservations.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          C. ABOUT ADSPOT 
         ======================================================== */}
      <section id="about" className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex justify-center">
                <img
                  src="/assets/Adspot_Mascoot_exploring.png"
                  alt="Adspot Exploring"
                  className="w-80 h-96 mx-auto object-contain filter drop-shadow-lg "
                />
            </div>
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-[#FC5701] uppercase tracking-widest block">
                Why Adspot Exists
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                Solving the Fragmentation of Offline Advertising
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Historically, offline advertising has been opaque and scattered. Booking a billboard
                or transit wrap meant calling dozens of individual local agencies, dealing with
                unverified availability, lack of transparent pricing, and having zero data on who
                actually passes by that physical spot.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Adspot unifies discovery, booking, transparent pricing, and geospatial intelligence
                into one modern platform. We empower businesses of every scale to plan informed,
                data-backed physical campaigns with certainty.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900">Unified Discovery</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Every format from unipoles to society flyers on a single map.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-900">Verified Pricing</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Clear breakdown of space charges, duration, and applicable taxes.
                  </p>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>

      {/* ========================================================
          D. TRADITIONAL ADVERTISING VS ADSPOT
         ======================================================== */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#FC5701] uppercase tracking-widest block mb-2">
              Clear Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Traditional Advertising vs. Adspot
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Adspot replaces fragmented offline vendor outreach with a modern, transparent marketplace.
              We do not make unsupported claims about guaranteed reach; we provide verified information
              to help you make informed decisions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 bg-slate-900 text-white p-5 text-center font-bold text-sm sm:text-base">
              <div className="text-slate-400">Traditional Offline Advertising</div>
              <div className="text-[#FC5701] flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4" /> The Adspot Platform
              </div>
            </div>

            <div className="divide-y divide-slate-200 text-xs sm:text-sm">
              {[
                {
                  trad: 'Requires contacting dozens of individual vendors and brokers individually.',
                  adspot: 'Centralized advertising-space marketplace with instant availability search.',
                },
                {
                  trad: 'Opaque pricing with arbitrary rate negotiations and hidden agent commissions.',
                  adspot: 'Transparent, standardized duration-based pricing with explicit tax breakdown.',
                },
                {
                  trad: 'Scattered listings with missing specs, dimensions, or clearance sightlines.',
                  adspot: 'Detailed listing specifications, photographs, illumination, and orientations.',
                },
                {
                  trad: 'Difficult audience planning based solely on vendor word-of-mouth claims.',
                  adspot: 'Interactive location-based discovery with verified demographic zone scoring.',
                },
                {
                  trad: 'Advertiser must coordinate printers, mounters, and compliance independently.',
                  adspot: 'Optional Adspot Managed Ads service handling execution end-to-end.',
                },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 p-5 items-center gap-4">
                  <div className="flex items-start gap-2.5 text-slate-600">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{row.trad}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-900 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{row.adspot}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          E. HOW ADSPOT TURNS PHYSICAL SPACES INTO ROI OPPORTUNITIES
         ======================================================== */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#FC5701] uppercase tracking-widest block mb-2">
              Campaign Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Budget to Campaign Execution
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              How our data-informed pipeline connects your marketing budget to high-performing
              physical advertising spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: 'Step 1',
                title: 'Define Audience & Budget',
                desc: 'Specify your target demographic and total campaign allocation.',
              },
              {
                step: 'Step 2',
                title: 'Geographic Discovery',
                desc: 'Map student clusters, IT corridors, or high-street retail zones.',
              },
              {
                step: 'Step 3',
                title: 'Space Comparison',
                desc: 'Evaluate unipoles, bus wraps, or posters side-by-side.',
              },
              {
                step: 'Step 4',
                title: 'Booking & Lock-in',
                desc: 'Reserve verified dates on the calendar without double-booking risk.',
              },
              {
                step: 'Step 5',
                title: 'Execution & Monitoring',
                desc: 'Track placement status, mounting proofs, and operational progress.',
              },
            ].map((node, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-[#FC5701] uppercase tracking-wider block mb-2">
                    {node.step}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">{node.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{node.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          F. ADVERTISING FORMATS
         ======================================================== */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-[#FC5701] uppercase tracking-widest block mb-2">
                Diverse Inventory
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Advertising Formats
              </h2>
            </div>
            <Link
              to="/explore"
              className="text-sm font-semibold text-[#FC5701] hover:underline flex items-center gap-1 mt-4 sm:mt-0"
            >
              Browse all categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {formats.map((format) => (
              <div
                key={format.id}
                onClick={() => navigate(`/explore?category=${format.id}`)}
                className="group bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 hover:border-[#FC5701] hover:shadow-card-hover transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={format.image}
                    alt={format.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/90 backdrop-blur-sm shadow-sm">
                    {format.icon}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#FC5701] transition-colors">
                      {format.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{format.desc}</p>
                  </div>
                  <div className="pt-4 flex items-center text-xs font-bold text-[#FC5701] gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View available spaces</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          G. PREMIUM FEATURES
         ======================================================== */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#FC5701] uppercase tracking-widest block mb-2">
              Competitive Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Premium Offerings
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Supercharge your offline campaigns with specialized geospatial intelligence and turnkey
              managed execution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature 1: Audience Location Insights */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#FC5701] text-xs font-bold">
                  <Compass className="w-3.5 h-3.5" />
                  Feature 1
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Audience Location Insights & Heatmaps
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Understand which geographic corridors are most relevant to your target demographic.
                  Search by business category and audience profile to discover verified footfall
                  density hotspots and transit intersections.
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-2">
                  <p className="font-semibold text-slate-900">Example Use-Case:</p>
                  <p className="text-slate-600 italic">
                    "A coaching institute targeting college students in Andheri West can discover nearby
                    degree colleges, metro feeder points, and student transit corridors."
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FC5701]" />
                    <span>Aggregated footfall and mobility scoring across key Indian metros</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FC5701]" />
                    <span>Interactive heatmap overlay with 24-Hour temporary unlock pass</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Button
                  variant="primary"
                  onClick={() => navigate('/maps')}
                  icon={<Compass className="w-4 h-4" />}
                >
                  Try Location Insights
                </Button>
              </div>
            </div>

            {/* Feature 2: Adspot Managed Ads */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#FC5701]" />
                  Feature 2
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Adspot Managed Ads</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Provide your budget, campaign objective, target audience, and preferred localities.
                  Adspot's operations desk takes care of vendor negotiation, high-resolution printing,
                  mounting proof verification, and end-to-end execution.
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-2">
                  <p className="font-semibold text-slate-900">Transparent Pricing Structure:</p>
                  <p className="text-slate-600">
                    Standard booking: space cost + 5% platform fee.
                    <br />
                    Optional Managed Service: +15% coordination charge (fully opt-in).
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Dedicated campaign strategist assigned to your brief</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Geo-tagged mounting proof photos and campaign tracking</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/explore')}
                  icon={<Target className="w-4 h-4" />}
                >
                  Select a Space with Managed Ads
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          H. SPACE-OWNER CTA
         ======================================================== */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <span className="text-xs font-bold text-[#FC5701] uppercase tracking-widest">
                Monetize Your Real Estate
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Own an Advertising Space? <br />
                <span className="text-[#FC5701]">Put It to Work.</span>
              </h2>
              <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                Whether you operate a prime roadside unipole, commercial building facade, bus fleet,
                or local kiosk, list your space on Adspot to connect with verified advertisers looking
                for offline exposure.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<PlusCircle className="w-5 h-5" />}
                  onClick={() => navigate('/list-your-space')}
                >
                  List Your Space for Free
                </Button>
                <Link
                  to="/faqs"
                  className="px-6 py-3.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-900 transition flex items-center gap-2"
                >
                  Read Owner Guidelines
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <img
                src="/assets/Adspot_lister_Mascoot.png"
                alt="Adspot Lister Mascot"
                className="w-64 sm:w-80 h-auto object-contain filter drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          I. FOUNDERS
         ======================================================== */}
      <section id="founders" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#FC5701] uppercase tracking-widest block mb-2">
              Leadership Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Meet the Founders
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Adspot was founded by four passionate builders committed to bringing transparency,
              data intelligence, and accessibility to India's offline advertising ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {founders.map((founder, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 text-center shadow-xs hover:border-[#FC5701] transition-colors"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 text-white flex items-center justify-center font-extrabold text-xl mb-4 shadow-md">
                  {founder.img}
                </div>
                <h3 className="text-base font-bold text-slate-900">{founder.name}</h3>
                <p className="text-xs text-[#FC5701] font-semibold mt-1">{founder.role}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-500 font-medium">
                  Adspot Technologies
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
  