const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // រក្សាទុក index.html ក្នុង folder "public"

// ព័ត៌មាន API ពី SMM Provider របស់អ្នក
const SMM_API_URL = 'https://smm-provider-website.com/api/v2';
const SMM_API_KEY = 'YOUR_SMM_PROVIDER_API_KEY_HERE'; // ដាក់ API Key របស់អ្នកនៅទីនេះ

// Endpoint ទទួល Order ពី Frontend
app.post('/api/order', async (req, res) => {
    const { service, link, quantity } = req.body;

    try {
        // បញ្ជូន Order ទៅកាន់ SMM Provider API
        const response = await axios.post(SMM_API_URL, new URLSearchParams({
            key: SMM_API_KEY,
            action: 'add',
            service: service, // ID សេវាកម្មក្នុង SMM Provider
            link: link,
            quantity: quantity
        }));

        if (response.data && response.data.order) {
            res.json({ success: true, order_id: response.data.order });
        } else {
            res.json({ success: false, error: response.data.error || 'ការកាត់ Order បរាជ័យ' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`BoostZS server is running on http://localhost:${PORT}`);
});
