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