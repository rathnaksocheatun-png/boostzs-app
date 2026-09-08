const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// -------------------------------------------------------------
// 1. កន្លែងកំណត់ព័ត៌មាន SMM Provider របស់អ្នក (ប្តូរនៅទីនេះ)
// -------------------------------------------------------------
const SMM_API_URL = 'https://smm-provider-website.com/api/v2'; // ជំនួសដោយ Domain របស់ Provider របស់អ្នក
const SMM_API_KEY = 'YOUR_SMM_API_KEY_HERE';                 // ជំនួសដោយ API Key របស់អ្នក

// API សម្រាប់ទទួល Order ពី Frontend
app.post('/api/order', async (req, res) => {
    const { service, link, quantity } = req.body;

    if (!service || !link || !quantity) {
        return res.status(400).json({ success: false, error: 'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់ប្រអប់!' });
    }

    try {
        // បញ្ជូនទិន្នន័យទៅ SMM Provider API
        const params = new URLSearchParams();
        params.append('key', SMM_API_KEY);
        params.append('action', 'add');
        params.append('service', service);
        params.append('link', link);
        params.append('quantity', quantity);

        const response = await axios.post(SMM_API_URL, params);

        if (response.data && response.data.order) {
            res.json({ 
                success: true, 
                order_id: response.data.order 
            });
        } else {
            res.json({ 
                success: false, 
                error: response.data.error || 'ការកាត់ Order ទៅ Provider បរាជ័យ សូមពិនិត្យ API Key ឬសមតុល្យទឹកប្រាក់!' 
            });
        }

    } catch (error) {
        console.error('Error connecting to SMM Provider:', error.message);
        res.status(500).json({ success: false, error: 'Server បរាជ័យក្នុងការភ្ជាប់ទៅកាន់ SMM Provider' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`BoostZS server running on port ${PORT}`);
});
