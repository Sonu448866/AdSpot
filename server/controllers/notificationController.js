import { Notification } from '../models/Notification.js';

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('relatedListing', 'title')
      .populate('relatedBooking', 'bookingReference')
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === 'all') {
      await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    } else {
      await Notification.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { read: true }
      );
    }

    res.json({ success: true, message: 'Notifications updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
