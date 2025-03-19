const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');
const auth = require('../middleware/auth'); // middleware that verifies JWT

// Other student routes...
router.post('/register', StudentController.register);
router.post('/login', StudentController.login);
router.post('/forgot-password', StudentController.forgotPassword);

// Protected route: Get full student info using JWT token (req.user.id)
router.get('/info', auth, StudentController.getStudentInfo);

module.exports = router;
