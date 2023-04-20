require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const nftRoutes = require('./routes/nftRoutes');

const app = express();
const PORT = process.env.PORT || 3001;



app.use(cors());
app.use(bodyParser.json());
app.use('/api/nft', nftRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
