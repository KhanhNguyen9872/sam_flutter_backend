const db = require('../utils/db');

class Student {
  // Create a new student (registration) with reduced required fields.
static async create(studentData) {
    const query = `
      INSERT INTO students (
        first_name, last_name, date_of_birth, email, password, gender, branch_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      studentData.first_name,
      studentData.last_name,
      studentData.date_of_birth,
      studentData.email,
      studentData.password,
      studentData.gender,
      3
    ];
    
    const [result] = await db.query(query, values);
    return result.insertId;
  }
  

  // Retrieve a student by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM students WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    return rows[0];
  }

  // Retrieve a student by their id
static async findById(id) {
    const query = 'SELECT * FROM students WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  // Update student's password (used for forgot password)
  static async updatePassword(email, hashedPassword) {
    const query = 'UPDATE students SET password = ? WHERE email = ?';
    const [result] = await db.query(query, [hashedPassword, email]);
    return result.affectedRows;
  }

  // Retrieve full info of a student by email
  static async getFullInfo(email) {
    const query = 'SELECT * FROM students WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    return rows[0];
  }
}

module.exports = Student;
