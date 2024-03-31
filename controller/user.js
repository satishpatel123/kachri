const { validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.CreateUser = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.json(result);
    } else {
      const user = new User(req.body);
      await user.save();
      res.json({
        data: user,
        message: "User created successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.GetUser = async (req, res, next) => {
  try {
    const user = await User.find();
    res.json({
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.UpdateUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    let existedUser = await User.findById(id);
    if (!existedUser) {
      return res.status(404).json({
        error: "Invalid User ID",
      });
    }

    if (req.body.name) {
      existedUser.name = req.body.name;
    }

    await existedUser.save();
    res.json({
      data: existedUser,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.getUserId = async (req, res, next) => {
  try {
    let id = req.params.id;
    let existedUser = await User.findById(id);
    if (!existedUser) {
      return res.status(404).json({
        error: "User Not found",
      });
    }
    res.json({
      data: existedUser,
      success: true,
      message: "user deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.DeleteUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    let existedUser = await User.findById(id);
    if (!existedUser) {
      return res.status(404).json({
        error: "User Not found",
      });
    } else {
      await User.findByIdAndDelete(id);
    }
    res.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email && !password) {
      res.status(400).send("Please enter email and password");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "10h",
        }
      );
      return res.status(200).json({
        data: user,
        token: token,
        message: "User has been login successfully ",
      });
    }
    return res.status(400).send({
      message: "Invalid email and Password",
      status: false,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!req.body.password && !req.body.name && !req.body.email) {
      return res.status(400).json({
        message: "Please Enter name, email and password",
        status_code: 400,
      });
    }

    const oldUser = await User.findOne({ email });
    const encryptedPassword = await bcrypt.hash(password, 10);
    if (oldUser) {
      return res.status(400).json({
        message: "Email is allready exist",
        status: 400,
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      role,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "10h",
      }
    );
    return res.status(201).json({
      data: user,
      token: token,
    });
  } catch (err) {
    console.log(err, "----err");
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.changepassword = async (req, res, next) => {
  try {
    console.log(req.user.user_id);
    let existedUser = await User.findById(req.user.user_id);
    if (!existedUser) {
      return res.status(404).json({
        error: "User Not found",
      });
    }
    const {oldpassword, newpassword} = req.body;
    const match = await bcrypt.compare(oldpassword, existedUser.password);
    if(match) {
      const encryptedPassword = await bcrypt.hash(newpassword, 10);
      if (newpassword) {
        existedUser.password = encryptedPassword;
      }
  
      await existedUser.save();
      res.json({
        message: "Password update has been successfully",
        success: true,
      });
    } else {
      res.status(200).json({
        message: "old password does not match",
        status: false
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
      status: false
    });
  }
};
