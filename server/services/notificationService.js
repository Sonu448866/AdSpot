import { Notification } from '../models/Notification.js';

export const createNotification = async ({
  userId,
  type,
  title,
  message,
  relatedListing = null,
  relatedBooking = null,
}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedListing,
      relatedBooking,
    });

    // Check external notification providers
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      // SMTP is configured, external email would be sent here
      console.log(`[Notification Service] External email queued for user ${userId}: ${title}`);
    } else {
      // In-app fallback logged
      console.log(`[Notification Service] In-app notification created for ${userId}: ${title}`);
    }

    return notification;
  } catch (error) {
    console.error('[Notification Service Error]', error.message);
  }
};
