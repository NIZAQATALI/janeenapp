import Course from "../models/Course.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      duration,
      level,
      category,
      isPublished,
    } = req.body;

    const file = req.file;
    let thumbnailUrl = null;

      console.log(req.file)
    if (file) {
      const cloudinaryResponse = await uploadOnCloudinary(file.buffer);
      if (cloudinaryResponse) {
       
        thumbnailUrl = cloudinaryResponse.secure_url;
        console.log(thumbnailUrl)
      } else {
        return res.status(500).json({
          success: false,
          message: "Thumbnail upload failed.",
        });
      }
    }

    const newCourse = new Course({
      title,
      description,
      price,
      duration,
      level,
      category,
      isPublished,
      instructor: req.user?._id,
      ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: savedCourse,
    });
  } catch (err) {
    console.error("Error creating course:", err);
    return res.status(500).json({
      success: false,
      message: "Course cannot be created.",
      error: err.message,
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "username email");

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "username email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateCourse = async (req, res) => {
  const _id = req.params.id;   // same pattern as user
  console.log(req.params,"id.....................")
  const file = req.file?.buffer;
  let thumbnailUrl = null;

  try {
    // Upload thumbnail if provided
    if (file) {
      const cloudinaryResponse = await uploadOnCloudinary(file, "courses");

      if (cloudinaryResponse) {
        thumbnailUrl = cloudinaryResponse.secure_url;
      } else {
        return res.status(500).json({
          status: "failed",
          success: false,
          message: "Thumbnail upload failed. Course not updated.",
        });
      }
    }

    // Spread body data
    const updateData = { ...req.body };
console.log(req.body,"updateData")
    // If thumbnail uploaded, attach it
    if (thumbnailUrl) updateData.thumbnail = thumbnailUrl;

    const updatedCourse = await Course.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true}
    );
console.log(updatedCourse,"updatedCourse")
    if (!updatedCourse) {
      return res.status(404).json({
        status: "failed",
        success: false,
        message: "Course not found. Update failed.",
      });
    }

    res.status(200).json({
      status: "success",
      success: true,
      message: "Course successfully updated",
      data: updatedCourse,
    });

  } catch (err) {
    res.status(500).json({
      status: "failed",
      success: false,
      message: "Course cannot be updated. Try again.",
      error: err.message,
    });
  }
};

export const updateCoursePdf = async (req, res) => {
  const _id = req.params.id;
  const file = req.file?.buffer;
  let pdfUrl = null;

  try {
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required.",
      });
    }
    const cloudinaryResponse = await uploadOnCloudinary(file, "courses/pdfs");
    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "PDF upload failed.",
      });
    }

    pdfUrl = cloudinaryResponse.secure_url;

    const updatedCourse = await Course.findByIdAndUpdate(
      _id,
      { $set: { pdf: pdfUrl } },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course PDF uploaded successfully.",
      data: updatedCourse,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Course PDF cannot be uploaded.",
      error: err.message,
    });
  }
};
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};