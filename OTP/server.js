const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // load .env variables

const app = express();
app.use(cors());
app.use(express.json());

// OTP storage
const otps = new Map(); // email -> { otp, timestamp }
// OTP request tracking for rate-limiting
const otpRequests = new Map(); // email -> [timestamps of recent requests]

const OTP_VALIDITY = 180 * 1000; // 180 seconds
const OTP_COOLDOWN = 30 * 1000; // 30 seconds between requests

// Nodemailer transporter (use env vars for security)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // e.g., your Gmail address
    pass: process.env.EMAIL_PASS, // your Gmail app password
  },
});

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Rate-limit check
function canRequestOTP(email) {
  const now = Date.now();
  const timestamps = otpRequests.get(email) || [];

  const recent = timestamps.filter((t) => now - t < OTP_COOLDOWN);
  otpRequests.set(email, recent);

  return recent.length === 0;
}

// Root route (test)
app.get('/', (req, res) => {
  res.send('✅ OTP Backend is running');
});

// Send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  if (!canRequestOTP(email)) {
    return res.status(429).json({ error: 'Please wait before requesting OTP again' });
  }

  const otp = generateOTP();
  otps.set(email, { otp, timestamp: Date.now() });

  const timestamps = otpRequests.get(email) || [];
  otpRequests.set(email, [...timestamps, Date.now()]);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Login',
    text: `Your OTP is ${otp}. It is valid for 60 seconds.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP ${otp} sent to ${email}`);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const stored = otps.get(email);

  if (!stored) return res.status(400).json({ error: 'No OTP found for this email' });

  if (Date.now() - stored.timestamp > OTP_VALIDITY) {
    otps.delete(email);
    return res.status(400).json({ error: 'OTP has expired' });
  }

  if (stored.otp === otp) {
    otps.delete(email);
    return res.json({ message: 'OTP verified successfully' });
  } else {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
