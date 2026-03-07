// import Enrollment from "../models/Enrollment.js";
// import Course from "../models/Course.js";

import Course from "../models/Course.js";
import Enrollment from "../models/enrollment.js";
export const enrollStudent = async (req, res) => {
  try {
    const userId = req.user._id;  
    const { courseId } = req.body;

   
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    return res.status(201).json({
      success: true,
      message: "Successfully enrolled in course",
      data: enrollment,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Enrollment failed",
      error: err.message,
    });
  }
};
export const getUserCourses = async (req, res) => {

  try {

    const userId = req.user._id;

    const enrollments = await Enrollment.find({ user: userId })
      .populate("course");

    return res.status(200).json({
      success: true,
      data: enrollments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
export const getCourseStudents = async (req, res) => {

  try {

    const { courseId } = req.query;

    const students = await Enrollment.find({
      course: courseId,
    }).populate("user");

    res.status(200).json({
      success: true,
      data: students,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};