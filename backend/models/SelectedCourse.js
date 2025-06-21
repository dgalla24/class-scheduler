const mongoose = require('mongoose');

const selectedCourseSchema = new mongoose.Schema({
    id: String,
    name: String,
    priority, String
});

module.exports = mongoose.model('SelectedCourse', selectedCourseSchema);