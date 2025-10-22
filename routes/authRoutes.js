const express = require('express');
const router = express.Router();
const { registerUser, loginUser,logoutUser} = require('../controllers/authController');
const getIpAndAgent = require('../middleware/getIP');

router.post('/register', getIpAndAgent, registerUser);
router.post('/login', getIpAndAgent, loginUser);
router.post('/logout', logoutUser);

module.exports = router;
