const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
   
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const city = req.query.city || 'Wroclaw';
    
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
   
    if (!response.ok) throw new Error(`Problem: ${response.statusText}`);

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('problem weatherApi:', error);
    res.status(500).json({ error: 'problem servera' });
  }
});

module.exports = router;
