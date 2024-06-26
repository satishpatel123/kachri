const { validationResult } = require("express-validator");
const User = require("../model/user");
const Contact = require("../model/contact");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail, tokenGenerator } = require("../utils/comman");
var CryptoJS = require("crypto-js");

exports.CreateUser = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.json(result);
    } else {
      let mobielNo = req.body.phoneNumber;
      const phoneNumber = await User.findOne({ phoneNumber: mobielNo });
      if (phoneNumber) {
        return res.status(404).json({
          error: "Phone Number is allready exist",
        });
      }

      let resEmail = req.body.email;
      const email = await User.findOne({ email: resEmail });
      if (email) {
        return res.status(404).json({
          error: "Email is allready exist",
        });
      }
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
    const user = await User.find().sort({ _id: -1 });

    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);

    // Calculate the start and end indexes for the requested page
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    // Slice the products array based on the indexes
    const paginatedUsers = user.slice(startIndex, endIndex);

    // Calculate the total number of pages
    const totalPages = Math.ceil(user.length / pageSize);
    res.json({
      data: paginatedUsers,
      totalPages,
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
    const { phoneNumber, password } = req.body;
    if (!phoneNumber && !password) {
      res.status(400).send("Please enter mobile number and password");
    }
    const user = await User.findOne({ phoneNumber });
    if(user) {
      if (user.password) {
        if((await bcrypt.compare(password, user.password))) {
          const token = jwt.sign(
            { user_id: user._id, phoneNumber, email: user.email },
            "hFB4rzSIjqoclVvIANXF5Fj8QWG6GOW6",
            {
              expiresIn: "10h",
            }
          );
          return res.status(200).json({
            data: user,
            token: token,
            message: "User has been login successfully ",
          });
        } else {
          return res.status(400).send({
            message: "Invalid phone number and password.",
            status: false,
          });
        }
        
      } else {
        return res.status(400).send({
          message: "You are login another role.",
          status: false,
        });
      }
    } else {
      return res.status(400).send({
        message: "Invalid phone number.",
        status: false,
      });
    }
   
    return res.status(400).send({
      message: "Invalid phone number and Password",
      status: false,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.socialLogin = async (req, res, next) => {
  try {
    const { socialId, name , email} = req.body;
    let user = "";
    if (socialId) {
      user = await User.findOne({ email: email });
    }
    if (user) {
      if(req.body.name) {
        user.name = req.body.name;
      }

      if(socialId) {
        user.google_id = socialId;
      }
      
      const secretKey = "hFB4rzSIjqoclVvIANXF5Fj8QWG6GOW6" || "";
      const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
        expiresIn: "24h",
      });
      
      await user.save();
      res.status(200).json({
        message: "User Login has been successfully",
        token: token,
        user: user,
        status: true,
      });
    } else {
      let userCreate = await User.create({
        name: name,
        email: email,
        role: "user",
        googleId: socialId,
      });
      const secretKey = "hFB4rzSIjqoclVvIANXF5Fj8QWG6GOW6" || "";
      const token = jwt.sign({ user_id: userCreate._id.toString(), email: userCreate.email }, secretKey, {
        expiresIn: "24h",
      });
      res.status(200).json({
        message: "User Login has been successfully",
        token: token,
        user: userCreate,
        status: true,
      });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};


exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;
    if (
      !req.body.password &&
      !req.body.name &&
      !req.body.email &&
      !req.body.phoneNumber
    ) {
      return res.status(400).json({
        message: "Please Enter name, email, phoneNumber and password",
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

    const oldphoneNumber = await User.findOne({ phoneNumber });
    if (oldphoneNumber) {
      return res.status(400).json({
        message: "Phone Number is allready exist",
        status: 400,
      });
    }
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      role,
      phoneNumber,
    });

    const token = jwt.sign(
      { user_id: user._id, email, phoneNumber },
      "hFB4rzSIjqoclVvIANXF5Fj8QWG6GOW6",
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
    let existedUser = await User.findById(req.user.user_id);
    if (!existedUser) {
      return res.status(404).json({
        error: "User Not found",
      });
    }
    const { oldpassword, newpassword } = req.body;
    const match = await bcrypt.compare(oldpassword, existedUser.password);
    if (match) {
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
        status: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "something went wrong",
      status: false,
    });
  }
};

exports.contactUs = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, message } = req.body;

    const contact = await Contact.create({
      name,
      phoneNumber,
      email,
      message,
    });
    return res.status(201).json({
      data: contact,
      status: true,
      message: "Message Send has been successfully",
    });
  } catch (err) {
    console.log(err, "----err");
    res.status(500).json({
      error: "something went wrong",
    });
  }
};

exports.forgetpassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    let existedUser = await User.findOne({ email: email });
    if (!existedUser) {
      return res.status(404).json({
        message: "Email User Not found",
      });
    }
    const token = await tokenGenerator();
    existedUser.token = token;
    await existedUser.save();
    const link = `https://www.kachari.in/resetPassword/${token}`;
    sendEmail(existedUser.email, link);
    return res.status(201).json({
      status: true,
      message: "Forget password mail Send has been successfully",
    });
  } catch (err) {
    console.log(err, "----err");
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    let user = await User.findOne({ token: req.params.token });
    if (!user) {
      return res.status(404).json({
        message: "Invalid link or expired",
        status: false,
      });
    }
    user.password = await bcrypt.hash(password, 10);
    user.token = "";
    await user.save();
    return res.status(201).json({
      status: true,
      message: "password reset sucessfully has been successfully",
    });
  } catch (err) {
    console.log(err, "----err");
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

exports.mobileUpdate = async (req, res, next) => {
  try {
    const { mobielNo } = req.body;
    let existedUser = await User.findById(req.user.user_id);
    if (!existedUser) {
      return res.status(404).json({
        message: "Mobile Number Not Found",
        status: false,
      });
    }
    existedUser.phoneNumber = mobielNo;
    await existedUser.save();
    return res.status(201).json({
      status: true,
      message: "Mobile number updated has been successfully",
    });
  } catch (err) {
    res.status(404).json({
      status: false,
      message: "Mobile number already exists",
    });
  }
};
