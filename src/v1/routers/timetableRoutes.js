// routers/timetableRoutes.js
const express = require('express');
const router = express.Router();
const TimetableController = require('../controllers/TimetableController');
// If you have an auth middleware, you can uncomment the following line.
const auth = require('../middleware/auth');
const { getBranchId } = require('../utils/lib');

router.get('/', auth, getBranchId, TimetableController.getAll);
router.get('/:id', auth, getBranchId, TimetableController.getById);

module.exports = router;
