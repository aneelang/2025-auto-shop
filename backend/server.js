// =============================================================
// FILE: backend/server.js
// INSTRUCTIONS: This is the final, production-ready version.
// =============================================================

// --- 1. Imports and Initial Setup ---
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// --- 2. Middleware ---

// --- FINAL CORS CONFIGURATION (THE FIX IS HERE) ---
const whitelist = [
  'http://localhost:3000', 
  'https://2025-auto-shop-hlob-arc4lxg8e-adithyas-projects-648ebdbe.vercel.app'
]; 
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));


// Enable parsing of JSON in request bodies
app.use(express.json());

// --- 3. Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB successfully connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- 4. Mongoose Schemas & Models ---

// Customer Schema
const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false },
}, { timestamps: true });
const Customer = mongoose.model('Customer', CustomerSchema);

// Vehicle Schema
const VehicleSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    vin: { type: String, unique: true, sparse: true },
}, { timestamps: true });
const Vehicle = mongoose.model('Vehicle', VehicleSchema);

// Job Schema
const JobSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    dateCreated: { type: Date, default: Date.now },
    status: { type: String, enum: ['Intake', 'In Progress', 'Awaiting Parts', 'Completed', 'Invoiced'], default: 'Intake' },
    items: [{
        description: { type: String, required: true },
        type: { type: String, enum: ['Labor', 'Part'], required: true },
        cost: { type: Number, required: true },
    }],
    notes: { type: String },
}, { timestamps: true });
const Job = mongoose.model('Job', JobSchema);

// --- 5. API Routes ---

// -- CUSTOMER ROUTES --
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/customers', async (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
    });
    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// -- VEHICLE ROUTES --
app.get('/api/customers/:customerId/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ customerId: req.params.customerId });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/vehicles', async (req, res) => {
    const vehicle = new Vehicle({
        customerId: req.body.customerId,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        vin: req.body.vin,
    });
    try {
        const newVehicle = await vehicle.save();
        res.status(201).json(newVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// -- JOB ROUTES --
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().populate('customerId').populate('vehicleId').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/jobs', async (req, res) => {
    const job = new Job({
        customerId: req.body.customerId,
        vehicleId: req.body.vehicleId,
        status: req.body.status,
        items: req.body.items,
        notes: req.body.notes
    });
    try {
        const newJob = await job.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// --- 6. Start Server ---
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
