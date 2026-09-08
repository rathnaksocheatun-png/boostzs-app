const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// កំណត់ឱ្យទាញយក index.html ទោះជានៅក្នុង public ឬនៅក្រៅក៏ដោយ
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ព័ត៌មាន API ពី SMM Provider
const SMM_API_URL = 'https://smm-provider-website.com/api/v2';
const SMM_API_KEY = 'YOUR_SMM_PROVIDER_API_KEY_HERE';

app.post('/api/order', async (req, res) => {
    const { service, link, quantity } = req.body;

    try {
        const response = await axios.post(SMM_API_URL, new URLSearchParams({
            key: SMM_API_KEY,
            action: 'add',
            service: service,
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
    console.log(`BoostZS server is running on port ${PORT}`);
});
