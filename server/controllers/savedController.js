import { SavedListing } from '../models/SavedListing.js';
import { Listing } from '../models/Listing.js';

export const getSavedListings = async (req, res) => {
  try {
    const saved = await SavedListing.find({ user: req.user._id })
      .populate({
        path: 'listing',
        select: 'title category price pricingUnit city locality images isAvailable verificationStatus specifications audienceAttributes',
        populate: { path: 'owner', select: 'name businessDetails.companyName' },
      })
      .sort({ createdAt: -1 });

    // Filter out if listing was deleted
    const validSaved = saved.filter((item) => item.listing !== null);

    res.json({
      success: true,
      data: validSaved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const existing = await SavedListing.findOne({
      user: req.user._id,
      listing: listingId,
    });

    if (existing) {
      return res.json({
        success: true,
        message: 'Listing is already saved',
        data: existing,
      });
    }

    const saved = await SavedListing.create({
      user: req.user._id,
      listing: listingId,
    });

    res.status(201).json({
      success: true,
      message: 'Listing saved to your favorites',
      data: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeSavedListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    await SavedListing.findOneAndDelete({
      user: req.user._id,
      listing: listingId,
    });

    res.json({
      success: true,
      message: 'Listing removed from saved items',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
