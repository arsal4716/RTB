const express = require('express');
const router = express.Router();
const { createForm,checkFormByPhone } = require('../controllers/formController');
const { verifyToken } = require('../middleware/authMiddleware'); 
router.post('/', verifyToken, createForm);
// router.get('/', verifyToken, getAllForms);
router.get('/check', checkFormByPhone);
module.exports = router;
