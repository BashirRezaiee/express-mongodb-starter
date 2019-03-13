const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = require("express").Router();
const { User } = require("../models/User");
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/avatars/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const mimes = ["image/jpeg", "image/png"];
  if (mimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("invalid file format"), false);
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
  fileFilter
});

// register router
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "isAdmin", "active"]));
});

// get the logged in user
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.send(
    _.pick(user, ["_id", "name", "email", "isAdmin", "active", "avatar"])
  );
});

// get all users
router.get("/all", [auth, admin], async (req, res) => {
  const users = await User.find({}, "_id name email isAdmin active");
  res.send(users);
});

// toggle admin role
router.post(
  "/:id/toggleRole",
  [auth, admin, validateObjectId],
  async (req, res) => {
    const user = await User.findById(mongoose.Types.ObjectId(req.params.id));
    user.isAdmin = !user.isAdmin;
    await user.save();

    res.send(user);
  }
);

// toggle status
router.post(
  "/:id/toggleStatus",
  [auth, admin, validateObjectId],
  async (req, res) => {
    const user = await User.findById(mongoose.Types.ObjectId(req.params.id));
    user.active = !user.active;
    await user.save();

    res.send(user);
  }
);

// toggle status
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const user = await User.findById(mongoose.Types.ObjectId(req.params.id));

  // ToDo : check for any integrity of the user with other parts, then delete
  user.remove();
  res.send(user);
});

router.post("/avatar", [auth, upload.single("avatar")], async (req, res) => {
  if (req.file) {
    const user = await User.findById(mongoose.Types.ObjectId(req.user._id));
    user.avatar = req.file.path;
    await user.save();

    return res.send(user);
  }
});

router.put("/profile", auth, async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(mongoose.Types.ObjectId(req.user._id));
  user.name = name;
  user.email = email;

  if (password && password.trim().length > 0) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  await user.save();

  return res.send(_.pick(user, ["name", "email", "id"]));
});

// grant admin permission to the user

function validate(req) {
  const schema = {
    email: Joi.string()
      .email()
      .min(5)
      .max(255),
    password: Joi.string()
      .min(5)
      .max(255),
    name: Joi.string()
      .min(3)
      .max(255)
  };

  return Joi.validate(req, schema);
}

module.exports = router;
