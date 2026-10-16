import { Listing } from '../models/Listing.js';
import { processUploadedFile } from '../config/cloudinary.js';
import { createNotification } from '../services/notificationService.js';

export const getPublicListings = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      locality,
      minPrice,
      maxPrice,
      format,
      lighting,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    // Strict filter: Public queries only return approved listings
    const filter = {
      verificationStatus: 'approved',
      isAvailable: true,
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { locality: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (city && city !== 'all') {
      filter.city = { $regex: `^${city}$`, $options: 'i' };
    }

    if (locality && locality !== 'all') {
      filter.locality = { $regex: locality, $options: 'i' };
    }

    if (format && format !== 'all') {
      filter.format = { $regex: format, $options: 'i' };
    }

    if (lighting && lighting !== 'all') {
      filter['specifications.lighting'] = lighting;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'impressions') sortOption = { 'audienceAttributes.estimatedDailyImpressions': -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('owner', 'name businessDetails.companyName')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Listing.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: listings,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('[Get Listings Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'owner',
      'name businessDetails.companyName businessDetails.contactPerson'
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Advertising space not found' });
    }

    // If listing is not approved, allow only owner or admin to inspect
    if (listing.verificationStatus !== 'approved') {
      const isOwner = req.user && req.user._id.toString() === listing.owner._id.toString();
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'This listing is pending verification or not publicly visible.',
        });
      }
    }

    // Find related listings in same city or category
    const related = await Listing.find({
      _id: { $ne: listing._id },
      verificationStatus: 'approved',
      $or: [{ city: listing.city }, { category: listing.category }],
    })
      .limit(4)
      .select('title category price pricingUnit city locality images audienceAttributes');

    res.json({
      success: true,
      data: listing,
      related,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createListing = async (req, res) => {
  try {
    // Only registered space owners or admins can list advertising spaces
    if (req.user?.role !== 'space_owner' && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must be logged in as a verified Space Owner to list advertising spaces.',
      });
    }

    const {
      title,
      description,
      category,
      format,
      dimensions,
      address,
      city,
      locality,
      postalCode,
      latitude,
      longitude,
      price,
      pricingUnit,
      minBookingDuration,
      specifications,
      audienceAttributes,
      existingImages,
    } = req.body;

    if (!title || !description || !category || !address || !city || !locality || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, address, city, locality, price',
      });
    }

    const lat = parseFloat(latitude) || 19.0760; // Mumbai fallback default
    const lng = parseFloat(longitude) || 72.8777;

    // Process files if uploaded
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const processed = await processUploadedFile(file);
        uploadedImages.push(processed);
      }
    }

    // If images passed via JSON (e.g. from gallery/links)
    if (existingImages) {
      const parsed = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      if (Array.isArray(parsed)) {
        uploadedImages = [...uploadedImages, ...parsed];
      }
    }

    // If no images uploaded, use a curated placeholder
    if (uploadedImages.length === 0) {
      uploadedImages.push({
        url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80',
        publicId: 'placeholder_billboard',
      });
    }

    const parsedDimensions = typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions;
    const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    const parsedAudience = typeof audienceAttributes === 'string' ? JSON.parse(audienceAttributes) : audienceAttributes;

    const newListing = await Listing.create({
      owner: req.user._id,
      title,
      description,
      category,
      format: format || 'Physical Display',
      dimensions: parsedDimensions || { width: 20, height: 10, unit: 'ft' },
      address,
      city,
      locality,
      postalCode: postalCode || '',
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      images: uploadedImages,
      price: Number(price),
      pricingUnit: pricingUnit || 'per_month',
      minBookingDuration: Number(minBookingDuration) || 7,
      specifications: parsedSpecs || {},
      audienceAttributes: parsedAudience || {},
      verificationStatus: 'pending', // Strictly pending verification by default
    });

    // Notify the space owner
    await createNotification({
      userId: req.user._id,
      type: 'listing_submitted',
      title: 'Listing Submitted for Review',
      message: `Your advertising space "${title}" has been submitted and is currently pending verification by our admin team.`,
      relatedListing: newListing._id,
    });

    res.status(201).json({
      success: true,
      message: 'Listing submitted successfully and is pending admin verification',
      data: newListing,
    });
  } catch (error) {
    console.error('[Create Listing Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const isOwner = listing.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this listing' });
    }

    // Extract fields
    const {
      title,
      description,
      category,
      format,
      price,
      pricingUnit,
      minBookingDuration,
      isAvailable,
      address,
      city,
      locality,
      latitude,
      longitude,
    } = req.body;

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (category) listing.category = category;
    if (format) listing.format = format;
    if (price) listing.price = Number(price);
    if (pricingUnit) listing.pricingUnit = pricingUnit;
    if (minBookingDuration) listing.minBookingDuration = Number(minBookingDuration);
    if (isAvailable !== undefined) listing.isAvailable = Boolean(isAvailable);
    if (address) listing.address = address;
    if (city) listing.city = city;
    if (locality) listing.locality = locality;
    if (latitude && longitude) {
      listing.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    // Process new images if uploaded
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const processed = await processUploadedFile(file);
        listing.images.push(processed);
      }
    }

    // Re-verification policy: if critical price or location edited by space owner, revert to pending
    if (isOwner && !isAdmin && (price || address || city || locality)) {
      listing.verificationStatus = 'pending';
      await createNotification({
        userId: req.user._id,
        type: 'system',
        title: 'Listing Re-verification Required',
        message: `Key information on "${listing.title}" was updated. It has been set to pending review for quality assurance.`,
        relatedListing: listing._id,
      });
    }

    await listing.save();

    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: listing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const isOwner = listing.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
