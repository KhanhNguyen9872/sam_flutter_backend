// controllers/TimetableController.js
const Timetable = require('../models/Timetable');
const moment = require('moment-timezone');

class TimetableController {
  // Helper function to format date from "yyyy-mm-dd" to "dd/mm/yyyy" in GMT+7
static formatDate(dateStr) {
    const date = moment.tz(dateStr, 'Asia/Bangkok'); // Set timezone to GMT+7 (Asia/Bangkok)
    const day = date.date().toString().padStart(2, '0');
    const month = (date.month() + 1).toString().padStart(2, '0'); // months are 0-indexed in moment.js
    const year = date.year();
    return `${day}/${month}/${year}`;
  }

  static formatStatus(date, timeStart, timeStop) {
    // Current time in GMT+7 (Asia/Bangkok)
    const currentDate = moment().tz('Asia/Bangkok');
  
    // Log inputs for debugging
    console.log('Input:', date, timeStart, timeStop);
  
    // Convert date to a moment object, handling different possible formats
    let dateMoment;
    if (moment(date, 'DD/MM/YYYY', true).isValid()) {
      // If date is in "DD/MM/YYYY" format
      dateMoment = moment.tz(date, 'DD/MM/YYYY', 'Asia/Bangkok');
    } else if (moment(date, moment.ISO_8601, true).isValid()) {
      // If date is an ISO string (e.g., "2025-03-19T17:00:00.000Z")
      dateMoment = moment.tz(date, 'Asia/Bangkok');
    } else {
      console.error('Invalid date format:', date);
      return 'Invalid date or time format';
    }
  
    // Parse start and stop times into hours, minutes, seconds
    const startParts = timeStart.split(':');
    const stopParts = timeStop.split(':');
    if (startParts.length !== 3 || stopParts.length !== 3) {
      console.error('Invalid time format:', timeStart, timeStop);
      return 'Invalid date or time format';
    }
  
    // Create start and end times based on the date
    const timetableDate = dateMoment.clone().set({
      hour: parseInt(startParts[0]),
      minute: parseInt(startParts[1]),
      second: parseInt(startParts[2])
    });
    const timeEnd = dateMoment.clone().set({
      hour: parseInt(stopParts[0]),
      minute: parseInt(stopParts[1]),
      second: parseInt(stopParts[2])
    });
  
    // Validate the parsed dates
    if (!timetableDate.isValid() || !timeEnd.isValid()) {
      console.error('Invalid parsed date/time:', date, timeStart, timeStop);
      return 'Invalid date or time format';
    }

    // Determine the event status
    if (currentDate.isAfter(timeEnd)) {
      return 'Đã kết thúc'; // Finished
    } else if (currentDate.isBetween(timetableDate, timeEnd, null, '[)')) {
      return 'Đang diễn ra'; // Ongoing
    } else if (timetableDate.isSame(currentDate, 'day')) {
      return 'Sắp diễn ra'; // About to happen
    } else {
      return 'Chưa diễn ra'; // Not yet happened
    }
  }
  // GET /timetables
  static async getAll(req, res) {
    try {
      const timetables = await Timetable.getAllTimetablesWithDetails();
      
      // Format each timetable entry and dynamically set the status
      const formattedTimetables = timetables.map(timetable => {
        return {
          ...timetable,
          date: TimetableController.formatDate(timetable.date),
          status: TimetableController.formatStatus(timetable.date, timetable.time_start, timetable.time_stop),
        };
      });

      return res.json(formattedTimetables);
    } catch (error) {
      console.error('Error fetching timetables:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // GET /timetables/:id
  static async getById(req, res) {
    const { id } = req.params;
    try {
      const timetable = await Timetable.getTimetableWithDetails(id);

      if (!timetable) {
        return res.status(404).json({ message: 'Timetable not found.' });
      }

      // Format the single timetable entry and set status dynamically
      timetable.date = TimetableController.formatDate(timetable.date);
      timetable.status = TimetableController.formatStatus(timetable.date, timetable.time_start, timetable.time_stop);

      return res.json(timetable);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = TimetableController;
