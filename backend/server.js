// server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/authRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://annapurna-frontend.onrender.com'
  'https://annapurna-rice.vercel.app'
];


app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // for image data or base64

app.use(session({
  secret: 'session_secret',
  resave: false,
  saveUninitialized: true,
}));


app.get('/', (req, res) => {
  res.send('API is running');
});


app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// DB & Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server running on port', process.env.PORT || 5000)
    );
  })
  .catch((err) => console.error(err));
