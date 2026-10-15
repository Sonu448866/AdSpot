import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { Booking } from '../models/Booking.js';
import { Payment } from '../models/Payment.js';
import { ContactEnquiry } from '../models/ContactEnquiry.js';
import { Notification } from '../models/Notification.js';

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adspot';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Listing.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      ContactEnquiry.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('[Seed] Cleared existing data');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Adspot System Admin',
      email: 'admin@adspot.com',
      password: 'Admin@123456',
      phone: '+91 98765 43210',
      role: 'admin',
      roles: ['admin', 'advertiser', 'space_owner'],
      isEmailVerified: true,
      isPhoneVerified: true,
      status: 'active',
    });

    const spaceOwnerUser = await User.create({
      name: 'Rajesh Sharma',
      email: 'owner@adspot.com',
      password: 'Owner@123456',
      phone: '+91 98200 12345',
      role: 'space_owner',
      roles: ['space_owner'],
      isEmailVerified: true,
      isPhoneVerified: true,
      businessDetails: {
        companyName: 'Apex Outdoor Media Pvt Ltd',
        contactPerson: 'Rajesh Sharma',
        businessPhone: '+91 98200 12345',
        businessAddress: '104, Link Plaza, New Link Road, Andheri West, Mumbai 400053',
        gstin: '27AABCA1234C1Z5',
      },
      status: 'active',
    });

    const spaceOwner2 = await User.create({
      name: 'Vikram Malhotra',
      email: 'vikram@adspot.com',
      password: 'Owner@123456',
      role: 'space_owner',
      roles: ['space_owner'],
      businessDetails: {
        companyName: 'TransitWave Hoardings NCR',
        contactPerson: 'Vikram Malhotra',
      },
      status: 'active',
    });

    const advertiserUser = await User.create({
      name: 'Pooja Mehta',
      email: 'advertiser@adspot.com',
      password: 'Advertiser@123456',
      phone: '+91 97690 98765',
      role: 'advertiser',
      roles: ['advertiser'],
      isEmailVerified: true,
      isPhoneVerified: true,
      businessDetails: {
        companyName: 'Zenith EdTech Academy',
        contactPerson: 'Pooja Mehta',
      },
      status: 'active',
    });

    console.log('[Seed] Created default users:');
    console.log('   Admin: admin@adspot.com / Admin@123456');
    console.log('   Owner: owner@adspot.com / Owner@123456');
    console.log('   Advertiser: advertiser@adspot.com / Advertiser@123456');

    // 2. Create Realistic Listings
    const listings = await Listing.create([
      {
        owner: spaceOwnerUser._id,
        title: 'Prime Unipole Hoarding - Western Express Highway Junction',
        description:
          'High-impact cantilevered unipole billboard positioned right at the bottleneck of the Western Express Highway in Andheri East, facing non-stop south-bound traffic towards Bandra and South Mumbai.',
        category: 'billboard',
        format: 'Unipole Cantilever Billboard',
        dimensions: { width: 40, height: 20, unit: 'ft' },
        address: 'WEH Flyover Pillar 14, Near Gundavali Metro Station, Andheri East',
        city: 'Mumbai',
        locality: 'Andheri East',
        postalCode: '400069',
        location: {
          type: 'Point',
          coordinates: [72.8597, 19.1172], // [lng, lat]
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80',
            publicId: 'seed_billboard_1',
          },
          {
            url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
            publicId: 'seed_billboard_1_alt',
          },
        ],
        price: 185000,
        pricingUnit: 'per_month',
        minBookingDuration: 14,
        specifications: {
          lighting: 'front_lit',
          orientation: 'facing_traffic',
          material: 'Premium Vinyl Frontlit Flex',
          clearanceView: 'Unobstructed 350m sightline',
        },
        audienceAttributes: {
          estimatedDailyImpressions: 145000,
          dailyFootfall: 45000,
          targetDemographics: ['Daily Commuters', 'Corporate Executives', 'Car Owners'],
          nearbyLandmarks: ['Gundavali Metro', 'Hubtown Solaris', 'WEH Junction'],
          commercialZoneType: 'Transit & Corporate Artery',
        },
        verificationStatus: 'approved',
        isAvailable: true,
      },
      {
        owner: spaceOwnerUser._id,
        title: 'Bandra West Linking Road Fashion District Rooftop Hoarding',
        description:
          'Dominant high-street rooftop billboard overlooking Linking Road and 33rd Junction, surrounded by flagship fashion stores, luxury boutiques, and high-frequency foot traffic.',
        category: 'billboard',
        format: 'Rooftop Billboard',
        dimensions: { width: 30, height: 15, unit: 'ft' },
        address: 'Above ZARA Building, Linking Road, Bandra West',
        city: 'Mumbai',
        locality: 'Bandra West',
        postalCode: '400050',
        location: {
          type: 'Point',
          coordinates: [72.8333, 19.0596],
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
            publicId: 'seed_billboard_2',
          },
        ],
        price: 240000,
        pricingUnit: 'per_month',
        minBookingDuration: 15,
        specifications: {
          lighting: 'back_lit',
          orientation: 'facing_traffic',
          material: 'Backlit Translucent Fabric',
          clearanceView: 'Direct intersection visibility',
        },
        audienceAttributes: {
          estimatedDailyImpressions: 110000,
          dailyFootfall: 75000,
          targetDemographics: ['Fashion Shoppers', 'Affluent Youth', 'Families'],
          nearbyLandmarks: ['National College', 'Linking Road Market', 'Bandra Station'],
          commercialZoneType: 'High-Street Retail',
        },
        verificationStatus: 'approved',
        isAvailable: true,
      },
      {
        owner: spaceOwner2._id,
        title: 'Full Exterior Bus Wrap - Prime South Mumbai Route',
        description:
          'Complete exterior side and back wrap on BEST AC Electric Bus operating from Colaba Depot to Bandra Station via Marine Drive and Haji Ali.',
        category: 'transit',
        format: 'Full Bus Exterior Wrap',
        dimensions: { width: 35, height: 8, unit: 'ft' },
        address: 'Colaba Depot to Bandra Terminal Fleet Route 83',
        city: 'Mumbai',
        locality: 'South Mumbai Transit',
        postalCode: '400005',
        location: {
          type: 'Point',
          coordinates: [72.8258, 18.9220],
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
            publicId: 'seed_transit_1',
          },
        ],
        price: 95000,
        pricingUnit: 'per_month',
        minBookingDuration: 30,
        specifications: {
          lighting: 'non_lit',
          orientation: 'facing_traffic',
          material: 'Cast Vinyl Vehicle Wrap with Anti-graffiti Lamination',
        },
        audienceAttributes: {
          estimatedDailyImpressions: 90000,
          dailyFootfall: 60000,
          targetDemographics: ['Pedestrians', 'Motorists', 'Tourists', 'Office Commuters'],
          nearbyLandmarks: ['Gateway of India', 'Marine Drive', 'Nariman Point'],
          commercialZoneType: 'Citywide Moving Transit',
        },
        verificationStatus: 'approved',
        isAvailable: true,
      },
      {
        owner: spaceOwnerUser._id,
        title: 'Door-to-Door High-Rise Society Pamphlet Insert Campaign',
        description:
          'Verified newspaper insertion and door drop across 10,000 gated residential apartments in Powai Hiranandani & Raheja Vistas complexes.',
        category: 'pamphlet',
        format: 'Residential Newspaper Insert & Door Drop',
        dimensions: { width: 8.5, height: 11, unit: 'in' },
        address: 'Hiranandani Gardens & Central Avenue, Powai',
        city: 'Mumbai',
        locality: 'Powai',
        postalCode: '400076',
        location: {
          type: 'Point',
          coordinates: [72.9051, 19.1176],
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80',
            publicId: 'seed_pamphlet_1',
          },
        ],
        price: 35000,
        pricingUnit: 'per_week',
        minBookingDuration: 7,
        specifications: {
          lighting: 'non_lit',
          orientation: 'indoor',
          material: '130 GSM Art Paper Color Print',
        },
        audienceAttributes: {
          estimatedDailyImpressions: 32000,
          dailyFootfall: 20000,
          targetDemographics: ['Upper Middle-Class Families', 'Tech Founders', 'Expats'],
          nearbyLandmarks: ['Galleria Mall', 'IIT Bombay Main Gate', 'Rodas Hotel'],
          commercialZoneType: 'Gated Luxury Residential',
        },
        verificationStatus: 'approved',
        isAvailable: true,
      },
      {
        owner: spaceOwner2._id,
        title: 'Connaught Place Radial Road Digital LED Display',
        description:
          'Ultra-bright outdoor P4 LED digital screen stationed at Radial Road 2, Connaught Place, New Delhi. Rotates 15-second high-definition motion ad spots.',
        category: 'digital_hoarding',
        format: 'Outdoor High-Brightness P4 LED Screen',
        dimensions: { width: 24, height: 12, unit: 'ft' },
        address: 'Block B, Inner Circle, Connaught Place',
        city: 'Delhi',
        locality: 'Connaught Place',
        postalCode: '110001',
        location: {
          type: 'Point',
          coordinates: [77.2167, 28.6315],
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
            publicId: 'seed_digital_1',
          },
        ],
        price: 160000,
        pricingUnit: 'per_month',
        minBookingDuration: 7,
        specifications: {
          lighting: 'digital_led',
          orientation: 'facing_traffic',
          material: 'Commercial IP65 Waterproof LED Cabinet',
        },
        audienceAttributes: {
          estimatedDailyImpressions: 180000,
          dailyFootfall: 95000,
          targetDemographics: ['Shoppers', 'Central Govt Professionals', 'Foodies'],
          nearbyLandmarks: ['Rajiv Chowk Metro Gate 5', 'Palika Bazaar', 'Wenger Bakery'],
          commercialZoneType: 'Historic Commercial & Financial Hub',
        },
        verificationStatus: 'approved',
        isAvailable: true,
      },
      {
        owner: spaceOwnerUser._id,
        title: 'Koramangala 80ft Road Premium Building Facade Banner',
        description:
          'Stunning building facade vertical banner facing the prime Sony World Junction corridor in Koramangala 4th Block, Bengaluru.',
        category: 'poster',
        format: 'Commercial Building Facade Banner',
        dimensions: { width: 18, height: 36, unit: 'ft' },
        address: '80 Feet Road, 4th Block, Koramangala',
        city: 'Bengaluru',
        locality: 'Koramangala',
        postalCode: '560034',
        location: {
          type: 'Point',
          coordinates: [77.6245, 12.9352],
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80',
            publicId: 'seed_poster_1',
          },
        ],
        price: 85000,
        pricingUnit: 'per_month',
        minBookingDuration: 14,
        specifications: {
          lighting: 'front_lit',
          orientation: 'facing_traffic',
          material: 'Heavy Duty 440 GSM Flex',
        },
        audienceAttributes: {
          estimatedDailyImpressions: 78000,
          dailyFootfall: 42000,
          targetDemographics: ['Startup Founders', 'Techies', 'College Students'],
          nearbyLandmarks: ['Sony World Signal', 'Koramangala Club', 'Oasis Centre'],
          commercialZoneType: 'Startup & Dining Corridor',
        },
        verificationStatus: 'approved',
        isAvailable: true,
      },
      // PENDING LISTING (For Admin Review demonstrations)
      {
        owner: spaceOwnerUser._id,
        title: 'New Commercial Arcade Front Billboard - Andheri West',
        description:
          'Newly fabricated rooftop billboard facing Oshiwara Link Road junction. High visibility near upcoming commercial office towers.',
        category: 'billboard',
        format: 'Rooftop Billboard',
        dimensions: { width: 25, height: 12, unit: 'ft' },
        address: 'Near Mega Mall, Oshiwara, Andheri West',
        city: 'Mumbai',
        locality: 'Andheri West',
        postalCode: '400102',
        location: {
          type: 'Point',
          coordinates: [72.8277, 19.1463],
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80',
            publicId: 'seed_pending_1',
          },
        ],
        price: 90000,
        pricingUnit: 'per_month',
        minBookingDuration: 14,
        specifications: {
          lighting: 'front_lit',
          orientation: 'facing_traffic',
        },
        audienceAttributes: {
          estimatedDailyImpressions: 55000,
          dailyFootfall: 28000,
          targetDemographics: ['Shoppers', 'Media Professionals'],
          nearbyLandmarks: ['Mega Mall', 'Oshiwara Police Station'],
          commercialZoneType: 'Mixed Commercial',
        },
        verificationStatus: 'pending', // Pending admin verification
        isAvailable: true,
      },
    ]);

    console.log(`[Seed] Created ${listings.length} advertising spaces`);

    // 3. Create Sample Confirmed Booking
    const approvedListing = listings[0];
    const startDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const endDate = new Date(Date.now() + 35 * 24 * 60 * 60 * 1000);

    const booking = await Booking.create({
      bookingReference: 'BK-2026-EX7812',
      advertiser: advertiserUser._id,
      listing: approvedListing._id,
      provider: spaceOwnerUser._id,
      startDate,
      endDate,
      durationDays: 30,
      pricing: {
        spaceCharges: 185000,
        durationDays: 30,
        platformFee: 9250,
        managedServiceFee: 0,
        taxAmount: 34965,
        totalAmount: 229215,
      },
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      managedAds: {
        enabled: false,
        status: 'not_applicable',
      },
    });

    // Mark booked range on listing
    approvedListing.bookedRanges.push({
      startDate,
      endDate,
      bookingId: booking._id,
    });
    await approvedListing.save();

    // Create Payment record
    const payment = await Payment.create({
      user: advertiserUser._id,
      booking: booking._id,
      paymentType: 'booking',
      razorpayOrderId: 'order_test_7812_sim',
      razorpayPaymentId: 'pay_test_9921_sim',
      razorpaySignature: 'simulated_sig_verified',
      amount: 229215,
      currency: 'INR',
      status: 'captured',
      webhookVerified: true,
    });

    booking.paymentReference = payment._id;
    await booking.save();

    // 4. Sample Contact Enquiry
    await ContactEnquiry.create({
      name: 'Rohan Deshmukh',
      email: 'rohan.d@horizonmedia.in',
      phone: '+91 99200 44556',
      subject: 'Inquiry regarding transit fleet campaign across Western Suburbs',
      message:
        'Hello Adspot team, we are planning a 60-day transit advertising campaign across 25 BEST buses for an upcoming FMCG product launch. We would like to understand multi-space package pricing and campaign coordination.',
      status: 'new',
    });

    // 5. Initial Notifications
    await Notification.create([
      {
        user: advertiserUser._id,
        type: 'booking_confirmed',
        title: 'Booking Confirmed: BK-2026-EX7812',
        message: 'Your advertising space on Western Express Highway has been confirmed. Campaign start date: ' + startDate.toLocaleDateString(),
        relatedBooking: booking._id,
        relatedListing: approvedListing._id,
      },
      {
        user: spaceOwnerUser._id,
        type: 'booking_confirmed',
        title: 'New Confirmed Booking for WEH Junction',
        message: 'Advertiser Zenith EdTech Academy has booked your space for 30 days.',
        relatedBooking: booking._id,
        relatedListing: approvedListing._id,
      },
      {
        user: spaceOwnerUser._id,
        type: 'listing_submitted',
        title: 'Listing Pending Review',
        message: 'Your listing "New Commercial Arcade Front Billboard" is currently in the review queue.',
        relatedListing: listings[6]._id,
      },
    ]);

    console.log('[Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
