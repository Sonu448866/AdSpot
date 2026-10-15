import crypto from 'crypto';
import { ManagedCampaign } from '../models/ManagedCampaign.js';
import { createNotification } from '../services/notificationService.js';

export const createCampaignBrief = async (req, res) => {
  try {
    const { objective, budget, targetAudience, geographicPreferences, brief } = req.body;

    if (!objective || !budget || !targetAudience || !brief) {
      return res.status(400).json({
        success: false,
        message: 'Please provide campaign objective, budget, target audience, and brief',
      });
    }

    const campaignRef = `MC-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const campaign = await ManagedCampaign.create({
      campaignReference: campaignRef,
      advertiser: req.user._id,
      objective,
      budget: Number(budget),
      targetAudience,
      geographicPreferences: geographicPreferences || { cities: ['Mumbai'], localities: [] },
      campaignBrief: brief,
      operationalStatus: 'submitted',
      progressHistory: [
        {
          status: 'submitted',
          note: 'Campaign brief received by Adspot Managed Services team.',
        },
      ],
    });

    await createNotification({
      userId: req.user._id,
      type: 'campaign_update',
      title: 'Managed Campaign Brief Received',
      message: `Your campaign brief ${campaignRef} has been assigned to our strategy desk. A dedicated campaign manager will review and contact you.`,
    });

    res.status(201).json({
      success: true,
      message: 'Managed campaign brief submitted successfully',
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await ManagedCampaign.find({ advertiser: req.user._id })
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
