const express = require('express');
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

// API ទទួលព័ត៌មាន Order ពីអតិថិជន
app.post('/api/order', (req, res) => {
    const { service, link, quantity, price } = req.body;

    console.log('--- ទទួលបាន Order ថ្មី ---');
    console.log(`សេវាកម្ម: ${service}`);
    console.log(`Link TikTok: ${link}`);
    console.log(`ចំនួន: ${quantity}`);
    console.log(`តម្លៃ: $${price}`);

    res.json({ success: true, message: 'Order ត្រូវ​បាន​កត់ត្រាទុក' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`BoostZS Server is running on port ${PORT}`);
});
