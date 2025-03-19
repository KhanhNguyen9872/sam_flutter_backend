const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Add this line
const crypto = require('crypto'); // Used to generate a random password for forgot-password

function parseDate(dobStr) {
    const parts = dobStr.split('/');
    if (parts.length !== 3) {
      throw new Error('Invalid date format');
    }
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

class StudentController {
// Helper function to parse a date in "DD/MM/YYYY" format to "YYYY-MM-DD"
 
  
  // POST /students/register
  static async register(req, res) {
    const { firstName, lastName, dob, email, password, gender } = req.body;
    
    // Validate that all required fields are provided.
    if (!firstName || !lastName || !dob || !email || gender == null || !password) {
      return res.status(400).json({ 
        message: 'All fields are required: firstName, lastName, dob, email, gender, password.' 
      });
    }
    
    try {
      // Check if a student with the given email already exists.
      const existingStudent = await Student.findByEmail(email);
      if (existingStudent) {
        return res.status(400).json({ message: 'Student already registered.' });
      }
      
      // Parse the date of birth to SQL compatible format (YYYY-MM-DD)
      const parsedDob = parseDate(dob);
      
      // Hash the password.
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Prepare data for insertion.
      const newStudentData = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: parsedDob,
        email: email,
        password: hashedPassword,
        gender: gender,
      };
      
      // Create the student record.
      const studentId = await Student.create(newStudentData);
      
      // Generate an access token using JWT.
      const accessToken = jwt.sign(
        { id: studentId, email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return res.status(201).json({ 
        message: 'Student registered successfully',
        accessToken
      });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }  
  

// POST /students/login
static async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
      const student = await Student.findByEmail(email);
      // Check if student exists and has a valid password
      if (!student || !student.password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Generate a JWT token using student's id as payload
      const accessToken = jwt.sign({ id: student.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
      return res.json({ message: 'Login successful', accessToken });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  

  // POST /students/forgot-password
  static async forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    try {
      const student = await Student.findByEmail(email);
      if (!student) {
        return res.status(400).json({ message: 'Student not found.' });
      }
      // Generate a new random password (8 hex characters)
      const newPassword = crypto.randomBytes(4).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await Student.updatePassword(email, hashedPassword);
      
      // In a real application, you would send this password via email.
      return res.json({ message: 'New password generated.', newPassword });
    } catch (error) {
      console.error('Error during forgotPassword:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // GET /students/info
  // This endpoint is protected and expects that authentication middleware sets req.user.id
  static async getStudentInfo(req, res) {
    try {
      // Retrieve the student's id from the request (set by auth middleware)
      const studentId = req.user.id;
      const student = await Student.findById(studentId);
      
      if (!student) {
        return res.status(404).json({ message: 'Student not found.' });
      }

      let formattedDob = '';
    if (student.date_of_birth) {
      const dobDate = new Date(student.date_of_birth);
      const day = String(dobDate.getDate()).padStart(2, '0');
      const month = String(dobDate.getMonth() + 1).padStart(2, '0');
      const year = dobDate.getFullYear();
      formattedDob = `${day}/${month}/${year}`;
    }
      
      // Format and return the student information
      const response = {
        first_name: student.first_name,
        name: student.last_name + ' ' + student.first_name,
        studentId: student.id, // e.g., "MSHV: G16-001"
        email: student.email,
        dob: formattedDob,             // e.g., "01/01/2000"
        phone: student.phone,
      };
      
      return res.json(response);
    } catch (error) {
      console.error('Error retrieving student info:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = StudentController;
