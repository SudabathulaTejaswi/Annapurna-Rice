import dotenv from 'dotenv';
dotenv.config();

export default {
  jwtSecret: process.env.JWT_SECRET,
  mongoURI: process.env.MONGO_URI
};

export const config = {
  twilioSID: process.env.TWILIO_SID,
  twilioToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhone: process.env.TWILIO_PHONE_NUMBER,
};
