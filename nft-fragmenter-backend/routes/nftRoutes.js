const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');

router.post('/fragment', nftController.fragmentNFT);
router.post('/defragment', nftController.defragmentNFT);

module.exports = router;
