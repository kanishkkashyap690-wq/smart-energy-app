const mongoose = require('mongoose');

const batterySchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Available', 'Rented', 'Charging', 'Maintenance'],
        default: 'Available'
    },
    vendorName: {
        type: String,
        default: 'None' // Jab battery Available hogi toh None dikhayega
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Battery', batterySchema);