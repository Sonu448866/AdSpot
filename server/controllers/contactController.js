import { ContactEnquiry } from '../models/ContactEnquiry.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required',
      });
    }

    const enquiry = await ContactEnquiry.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      subject,
      message,
      status: 'new',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our team will contact you shortly.',
      data: {
        id: enquiry._id,
        name: enquiry.name,
        subject: enquiry.subject,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
