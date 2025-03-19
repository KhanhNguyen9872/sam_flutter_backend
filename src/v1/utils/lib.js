// utils/lib.js
const db = require('./db');

async function getBranchId(req, res, next) {
  try {
    // Ensure req.user.id is available
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Query the database to fetch the branch_id from the students table based on user.id
    const query = 'SELECT branch_id FROM students WHERE id = ?';
    const [rows] = await db.query(query, [req.user.id]);

    // Check if the user was found and has a branch_id
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found or branch_id not assigned' });
    }

    // Attach the branch_id to req.user for use in the next middleware or route handler
    req.user.branch_id = rows[0].branch_id;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error('Error retrieving branch_id:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getBranchId };
