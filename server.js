const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// Line 5 ko isse replace karein
const Battery = require('./models/Battery');

dotenv.config({ path: './.env' });
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/SmartEnergyDB")
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.log("❌ DB Connection Error:", err));

app.get('/', (req, res) => {
    res.send("Smart Energy API is running with Database...");
});

// Test Route: Data add karne ke liye
app.get('/api/batteries/test-add', async (req, res) => {
    try {
        const testBattery = new Battery({
            serialNumber: "BATT-" + Math.floor(Math.random() * 1000),
            status: "Available"
        });
        await testBattery.save();
        res.send("✅ Success! Data database mein save ho gaya.");
    } catch (err) {
        res.status(500).send("Galti hui: " + err.message);
    }
});

// Routes ko link karein
app.use('/api/batteries', require('./routes/batteryroutes'));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});