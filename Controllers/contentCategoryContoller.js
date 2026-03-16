import ContentCategory from "../models/stagecontent.js";


// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const category = await ContentCategory.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
  try {
    const data = await ContentCategory.find();

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET CATEGORY BY ID
export const getCategoryById = async (req, res) => {
  try {
    const data = await ContentCategory.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const data = await ContentCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    await ContentCategory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* ------------------- STAGE CRUD ------------------- */


// ADD STAGE
export const addStage = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await ContentCategory.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.stages.push(req.body);

    await category.save();

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// UPDATE STAGE
export const updateStage = async (req, res) => {
  try {
    const { categoryId, stageId } = req.params;

    const category = await ContentCategory.findById(categoryId);

    const stage = category.stages.id(stageId);

    if (!stage) {
      return res.status(404).json({
        success: false,
        message: "Stage not found",
      });
    }

    Object.assign(stage, req.body);

    await category.save();

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE STAGE
export const deleteStage = async (req, res) => {
  try {
    const { categoryId, stageId } = req.params;

    const category = await ContentCategory.findById(categoryId);

    category.stages.id(stageId).remove();

    await category.save();

    res.json({
      success: true,
      message: "Stage deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* ------------------- USER CONTENT FETCH ------------------- */


export const getUserStageContent = async (req, res) => {
  try {

    const { category } = req.params;
    const { month } = req.query;
console
    const data = await ContentCategory.findOne({
      category,
      isActive: true
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    const stage = data.stages.find(
      (s) =>
        month >= s.startMonth &&
        month <= s.endMonth
    );

    res.json({
      success: true,
      data: stage,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};