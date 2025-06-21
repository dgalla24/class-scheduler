import React, { useState, useEffect } from 'react';
import './CourseStats.css';

const CourseStats = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/courses.json')
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const total = courses.length;
  const departments = [...new Set(courses.map(c => c.department))];

  return (
    <div className="course-stats">
      <h2>Course Stats</h2>
      <p>Total courses: {total}</p>
      <p>Departments: {departments.join(', ')}</p>
    </div>
  );
};

export default CourseStats;
