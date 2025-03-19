const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
// Protected route: requires valid JWT
router.get('/users', auth, UserController.getUsers);

module.exports = router;
