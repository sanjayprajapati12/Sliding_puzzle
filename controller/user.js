const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomstr = require("randomstring");
const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

// Input validation
const validateSigninInput = require("../validation/signIn");
const validateLoginInput = require("../validation/login");

// @desc   Add user data
//@route   /

exports.signIn = (req, res, next) => {
  // check validation
  // console.log(JSON.stringify(req.body));
  // return req.body;

  const { errors, isValid } = validateSigninInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ $or: [{ email: email }, { password: password }] }).then(
    (user, err) => {
      if (user === null) {
        bcrypt.hash(req.body.password, 10, async (err, hashedPass) => {
          if (err) {
            res.json({
              error: err,
            });
          }
          const secretToken = randomstr.generate();
          let newuser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            secretToken: secretToken,
            active: false,
          });

          console.log(newuser);
          await newuser.save();
          // return "User add successfully";
          // send mail
          let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.GMAIL_USER, //  ethereal user
              pass: process.env.GMAIL_PASS, //  ethereal password
            },
          });

          const message = {
            from: '"Sanjay Prajapati" <sanjayprajapati19832002@gmail.com>',
            to: req.body.email,
            subject: "Email verification",
            html: `Hello,<br> Please Click on the link and send the below token to verify your email.<br>
                  token:${secretToken}<br><a href="http://localhost:5000/verify">Click here to verify</a>`,
            tls: {
              rejectUnauthorized: false,
            },
          };

          await transporter.sendMail(message, (err, info) => {
            if (err) return console.log(err);
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            res.json({
              valid: true,
              message: "Verification message is sent to your email",
            });
          });
        });
      } else {
        res.json({
          valid: false,
          message: "User already exist with this email!",
        });
      }
    }
  );
};

exports.verify = async (req, res, next) => {
  // check validation
  if (!req.body) {
    return res.status(404).json({ message: "Please fill secretToken" });
  }
  try {
    const { secretToken } = req.body;
    const user = await User.findOne({ secretToken: secretToken });

    if (!user) {
      return res.json({
        ok: false,
        message: "SecretToken doen't match ",
      });
    }

    user.active = true;
    user.secretToken = "";
    await user.save();
    res.json({
      ok: true,
      user: user,
      message: "Successfully verified",
    });
  } catch (err) {
    res.json({
      ok: false,
      error: err,
    });
  }
};

exports.login = (req, res, next) => {
  // Check validation
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ $or: [{ email: email }, { password: password }] }).then(
    (user, err) => {
      if (user === null) {
        res.json({
          ok: false,
          message: "No user found!",
        });
      }

      if (user.active === false) {
        res.json({
          ok: false,
          message: "First you need to verify your Email",
        });
      } else {
        // console.log(user);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.json({
              message: err,
            });
          }
          if (result) {
            let token = jwt.sign(
              { username: user.username },
              "50d84g94g404)9",
              { expiresIn: "1h" }
            );
            res.json({
              ok: true,
              user: user,
              message: "Login Successful!",
            });
          } else {
            res.json({
              ok: false,
              message: "Password does not matched!",
            });
          }
        });
      }
    }
  );
};

exports.getTime = async (req, res, next) => {
  
  const email = req.query.email;
  const active = req.query.active;

  if (active === false) {
    res.json({
      ok: false,
      message: "First you need to verify your Email",
    });
  }
  
  try {
    const user = await User.findOne({email : email});

    if (!user) {
      return res.json({
        ok: false,
        message: "No user found",
      });
    }

    res.json({
      ok: true,
      time: user.time,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.addTime = async (req, res, next) => {
  if (!req.body) {
    return res.status(404).json({ message: "Don't do empty request" });
  }
  const email = req.body.email;
  const active = req.body.active;
  const new_time = req.body.time;
  if (active === false) {
    res.json({
      ok: false,
      message: "First you need to verify your Email",
    });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ message: "No user found" });
    }

    user.time.push(new_time);
    await user.save();
    res.json({
      ok: true,
      message: "Time added successfully ",
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};
