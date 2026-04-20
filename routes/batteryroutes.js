const express = require('express');
const router = express.Router();
// Purana code: const Battery = require('./models/Battery');
// Naya code (Ise copy karein):
const Battery = require(__dirname + '/../models/Battery.js');

// 1. Sabhi Batteries ki list dekhne ke liye (Dashboard ke liye)
router.get('/all', async (req, res) => {
    try {
        const batteries = await Battery.find();
        res.json(batteries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Nayi Battery register karne ke liye (Inventory Management)
router.post('/add', async (req, res) => {
    const battery = new Battery({
        serialNumber: req.body.serialNumber,
        status: req.body.status || 'Available'
    });

    try {
        const newBattery = await battery.save();
        res.status(201).json(newBattery);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. Battery ka status update karne ke liye (Rent par dene ke liye)
router.put('/update/:id', async (req, res) => {
    try {
        const updatedBattery = await Battery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedBattery);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Nayi Battery add karne ke liye (Post Route)
router.post('/add', async (req, res) => {
    try {
        const newBattery = new Battery({
            serialNumber: req.body.serialNumber,
            status: "Available" // Default status
        });
        const savedBattery = await newBattery.save();
        res.status(201).json(savedBattery);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// 1. Battery delete karne ke liye
router.delete('/:id', async (req, res) => {
    try {
        await Battery.findByIdAndDelete(req.params.id);
        res.json({ message: "Battery deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Status aur Vendor update karne ke liye (Rent Out logic)
router.put('/update/:id', async (req, res) => {
    try {
        const updatedBattery = await Battery.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
                vendorName: req.body.vendorName || "None"
            },
            { new: true }
        );
        res.json(updatedBattery);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// 1. Battery ko delete karne ke liye
router.delete('/:id', async (req, res) => {
    try {
        await Battery.findByIdAndDelete(req.params.id);
        res.json({ message: "Battery deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Battery ka status aur vendor update karne ke liye
router.put('/update/:id', async (req, res) => {
    try {
        const updatedBattery = await Battery.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
                vendorName: req.body.vendorName || "None"
            },
            { new: true }
        );
        res.json(updatedBattery);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
module.exports = router;