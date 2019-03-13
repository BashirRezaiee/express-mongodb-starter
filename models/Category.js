const mongoose = require("mongoose");
const Joi = require("joi");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 3
  },
  items_count: {
    type: Number,
    default: 0
  }
}, {timestamps: true});

// validation
function validateCategory(category) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
      .max(255)
  };

  return Joi.validate(category, schema);
}

const Category = mongoose.model("Category", CategorySchema);

exports.Category = Category;
exports.validate = validateCategory;
exports.CategorySchema = CategorySchema;
