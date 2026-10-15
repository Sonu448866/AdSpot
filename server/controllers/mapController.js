import { Listing } from '../models/Listing.js';
import { PremiumEntitlement } from '../models/PremiumEntitlement.js';
import { generateAudienceRecommendations, AUDIENCE_ZONES } from '../services/insightsService.js';

export const getMapListings = async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, format } = req.query;

    const filter = {
      verificationStatus: 'approved',
      location: { $exists: true },
    };

    if (category && category !== 'all') filter.category = category;
    if (city && city !== 'all') filter.city = { $regex: `^${city}$`, $options: 'i' };
    if (format && format !== 'all') filter.format = { $regex: format, $options: 'i' };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter)
      .select('title category format price pricingUnit address city locality location images isAvailable bookedRanges specifications audienceAttributes')
      .populate('owner', 'name businessDetails.companyName');

    const now = new Date();

    // Map marker status formatting
    const markers = listings.map((item) => {
      // Check if currently booked
      const isCurrentlyBooked = item.bookedRanges?.some((range) => {
        const s = new Date(range.startDate);
        const e = new Date(range.endDate);
        return now >= s && now <= e;
      });

      let statusColor = 'green'; // Available
      let statusLabel = 'Available';

      if (!item.isAvailable || isCurrentlyBooked) {
        statusColor = 'red'; // Booked / Unavailable
        statusLabel = 'Booked';
      } else if (item.verificationStatus === 'pending') {
        statusColor = 'amber';
        statusLabel = 'Pending Review';
      }

      return {
        id: item._id,
        title: item.title,
        category: item.category,
        format: item.format,
        price: item.price,
        pricingUnit: item.pricingUnit,
        address: item.address,
        city: item.city,
        locality: item.locality,
        coordinates: item.location?.coordinates || [72.8777, 19.0760], // [lng, lat]
        thumbnail: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80',
        statusColor,
        statusLabel,
        owner: item.owner?.businessDetails?.companyName || item.owner?.name || 'Verified Partner',
        impressions: item.audienceAttributes?.estimatedDailyImpressions || 25000,
        lighting: item.specifications?.lighting || 'Standard',
      };
    });

    res.json({
      success: true,
      count: markers.length,
      data: markers,
    });
  } catch (error) {
    console.error('[Map Listings Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAudienceInsights = async (req, res) => {
  try {
    const {
      businessCategory = '',
      targetAudience = '',
      campaignObjective = '',
      city = 'Mumbai',
      locality = '',
    } = req.query;

    const recommendations = generateAudienceRecommendations({
      businessCategory,
      targetAudience,
      city,
      locality,
    });

    // Find available approved listings in the top recommended zones
    const topZoneLocalities = recommendations.slice(0, 3).map((z) => z.locality);
    const matchingListings = await Listing.find({
      verificationStatus: 'approved',
      city: { $regex: city, $options: 'i' },
      $or: topZoneLocalities.map((loc) => ({ locality: { $regex: loc, $options: 'i' } })),
    })
      .select('title category price pricingUnit locality city images location audienceAttributes')
      .limit(6);

    res.json({
      success: true,
      city,
      query: { businessCategory, targetAudience, campaignObjective },
      recommendations,
      matchingListings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHeatmapData = async (req, res) => {
  try {
    const { city = 'Mumbai' } = req.query;

    let isUnlocked = false;
    let entitlement = null;

    if (req.user) {
      if (req.user.role === 'admin') {
        isUnlocked = true;
      } else {
        // Check active entitlement in MongoDB
        entitlement = await PremiumEntitlement.findOne({
          user: req.user._id,
          status: 'active',
          expiryDate: { $gt: new Date() },
        }).sort({ expiryDate: -1 });

        if (entitlement) {
          isUnlocked = true;
        }
      }
    }

    // Filter zones for this city
    const filteredZones = AUDIENCE_ZONES.filter(
      (z) => z.city.toLowerCase() === city.toLowerCase()
    );

    // If locked, return sample preview with lower resolution and requiresPremium flag
    if (!isUnlocked) {
      const previewPoints = filteredZones.slice(0, 2).map((zone) => ({
        lat: zone.center[1],
        lng: zone.center[0],
        intensity: zone.densityScore / 100,
        locality: zone.locality,
      }));

      return res.json({
        success: true,
        requiresPremium: true,
        isUnlocked: false,
        message: 'Audience heatmap layer requires a Premium Unlock pass or active subscription.',
        pricingOptions: [
          { type: 'audience_heatmap_24h', title: '24-Hour Day Pass', price: 499, duration: '24 Hours' },
          { type: 'audience_heatmap_monthly', title: '30-Day Pro Access', price: 2999, duration: '30 Days' },
        ],
        previewData: previewPoints,
      });
    }

    // Unlocked: Generate dense points around primary zones
    const heatmapPoints = [];
    filteredZones.forEach((zone) => {
      const [cLng, cLat] = zone.center;
      // Center hot spot
      heatmapPoints.push({
        lat: cLat,
        lng: cLng,
        intensity: zone.densityScore / 100,
        locality: zone.locality,
        landmarks: zone.primaryLandmarks,
      });

      // Radiate surrounding sub-clusters for realistic heatmap visualization
      const deltas = [
        [0.005, 0.005, 0.85],
        [-0.005, -0.005, 0.80],
        [0.007, -0.004, 0.75],
        [-0.006, 0.006, 0.70],
      ];
      deltas.forEach(([dLat, dLng, factor]) => {
        heatmapPoints.push({
          lat: cLat + dLat,
          lng: cLng + dLng,
          intensity: (zone.densityScore / 100) * factor,
          locality: zone.locality,
        });
      });
    });

    res.json({
      success: true,
      requiresPremium: false,
      isUnlocked: true,
      expiryDate: entitlement ? entitlement.expiryDate : null,
      source: 'Adspot Aggregated Geospatial Mobility & Commercial Activity Index',
      lastUpdated: 'October 2026',
      data: heatmapPoints,
    });
  } catch (error) {
    console.error('[Heatmap Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkHeatmapStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: true, isUnlocked: false });
    }

    if (req.user.role === 'admin') {
      return res.json({ success: true, isUnlocked: true, isAdmin: true });
    }

    const entitlement = await PremiumEntitlement.findOne({
      user: req.user._id,
      status: 'active',
      expiryDate: { $gt: new Date() },
    }).sort({ expiryDate: -1 });

    res.json({
      success: true,
      isUnlocked: !!entitlement,
      entitlement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
