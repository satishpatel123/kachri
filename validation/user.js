const { validationResult } = require("express-validator");
const User = require("../model/user");

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
    if (req.body.title) {
      existedUser.title = req.body.title;
    }
    if (req.body.description) {
      existedUser.description = req.body.description;
    }
    if (req.body.image) {
      existedUser.image = req.body.image;
    }
    if (req.body.price) {
      existedUser.price = req.body.price;
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
	try  {
    console.log(req.body)
		// const validationRule = {
		// 	"email": "required|string|email",
		// 	"password": "required|string|min:8",
		// };
		// await validator(req.body, validationRule, {}, async(err, status) => { 
		// 	const { email, password } = req.body;
		// 	if (!email && !password) {
		// 		res.status(400).send("Please enter email and password");
		// 	}
		// 	const user = await userModel.findOne({ email });
		// 	if (user && (await bcrypt.compare(password, user.password))) {
		// 		const token = jwt.sign(
		// 		{ user_id: user._id, email },
		// 		process.env.TOKEN_KEY,
		// 		{
		// 			expiresIn: "10h",
		// 		}
		// 		);
		// 		return res.status(200).json({
		// 			data : user,
		// 			token: token,
		// 			message: "User has been login successfully "
		// 		});
		// 	}
		// 	return res.status(400).send({
		// 		message: "Invalid email and Password",
		// 		status: false
		// 	});
		// }).catch( err => {
		// 	return res.status(500).json({
    //             error: err,
    //             status: 500
    //         });
		// })
		
	} catch(err) {
		return res.status(400).json(err);
	}
};
