// models/Timetable.js
const db = require('../utils/db');

class Timetable {
  // Retrieve a single timetable record with joined names, excluding _id fields.
  static async getTimetableWithDetails(id) {
    const query = `
      SELECT t.title,
             t.topic,
             t.time_start,
             t.time_stop,
             t.date,
             CONCAT(tr.first_name, ' ', tr.last_name) AS teacher,
             r.name AS room,
             c.name AS class
      FROM timetable t
      LEFT JOIN classes c ON t.class_id = c.id
      LEFT JOIN teachers tr ON t.teacher_id = tr.id
      LEFT JOIN room r ON t.room_id = r.id
      WHERE t.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  // Retrieve all timetable records with joined names, excluding _id fields.
  static async getAllTimetablesWithDetails() {
    const query = `
      SELECT t.title,
             t.topic,
             t.time_start,
             t.time_stop,
             t.date,
             CONCAT(tr.first_name, ' ', tr.last_name) AS teacher,
             r.name AS room,
             c.name AS class
      FROM timetable t
      LEFT JOIN classes c ON t.class_id = c.id
      LEFT JOIN teachers tr ON t.teacher_id = tr.id
      LEFT JOIN room r ON t.room_id = r.id
    `;
    const [rows] = await db.query(query);
    return rows;
  }
}

module.exports = Timetable;
