const express = require('express');
const router = express.Router();

const SOLAR_API_KEY = process.env.GOOGLE_SOLAR_API_KEY;

// Get solar data by coordinates
router.get('/coordinates', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ 
                error: 'Missing required parameters: lat and lng' 
            });
        }

        if (!SOLAR_API_KEY) {
            return res.status(500).json({ 
                error: 'Google Solar API key not configured' 
            });
        }

        const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${SOLAR_API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Google API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Error fetching solar data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch solar data',
            message: error.message 
        });
    }
});

// Get solar data by postal code
router.get('/postal', async (req, res) => {
    try {
        const { postalCode } = req.query;
        
        if (!postalCode) {
            return res.status(400).json({ 
                error: 'Missing required parameter: postalCode' 
            });
        }

        if (!SOLAR_API_KEY) {
            return res.status(500).json({ 
                error: 'Google Solar API key not configured' 
            });
        }

        const url = `https://solar.googleapis.com/v1/buildingInsights:findByPostalCode?postalCode=${postalCode}&requiredQuality=HIGH&key=${SOLAR_API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Google API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Error fetching postal data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch postal data',
            message: error.message 
        });
    }
});

module.exports = router;