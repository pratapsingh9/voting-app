const express = require("express");
const UserModels = require("../models/Users");
const router = express.Router();
const jwt = require("jsonwebtoken");
const usermodel = require("../models/Users");
const SecretKey = "MyKey";
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { PartySchema, PartyModel } = require("../models/Parties");

router.post("/post", async (req, res) => {
  const cookieToken = req.cookies.token;

  console.log(cookieToken);
  if (cookieToken) {
    try {
      const decoded = jwt.decode(cookieToken, SecretKey);
      const username = decoded.username;
      const findedperson = await UserModels.findOne({
        username: username,
      });
      const TruePassword = await bcrypt.compare(findedperson.password, 10);
      if (TruePassword) {
        return res.status(201).json({
          message: "token exists",
          name: decoded.name,
          password: decoded.password,
          email: decoded.email,
        });
      }
      return res.status(402).json({
        message: "invalid password and token",
      });
    } catch (error) {
      return res.status(501).json({
        memssage: "internal server error",
      });
    }
  }
  try {
    const { username, password, email, name } = req.body;

    if (!username || !password || !email || !name) {
      return res.status(401).json({
        message: "no proper details found",
      });
    }

    const AlreadyExistsUser = await usermodel.findOne({
      name: name,
      username: username,
      email: email,
      password: password,
    });

    if (AlreadyExistsUser) {
      return res.status(401).json({
        message: "user already exists",
        name: AlreadyExistsUser.name,
        username: AlreadyExistsUser.username,
        email: AlreadyExistsUser.email,
        password: AlreadyExistsUser.password,
        redirection: "user will be redireted to logined",
      });
    }

    const CreateNewPerson = await new usermodel({
      name: name,
      username: username,
      email: email,
      password: password,
    });

    await CreateNewPerson.save();

    console.log(`user saved properly`);

    const Jwttoken = jwt.sign(
      {
        name: name,
        username: username,
        password: password,
        email: email,
      },
      SecretKey
    );

    res.cookie("token", Jwttoken);

    console.log(`cookie also setted there in the broweser`);

    return res.status(201).send("user create succesfully");
  } catch (error) {
    console.log(error);
    return res.status(499).json({
      message: "internal server error",
      problem: error,
    });
  }
});

router.patch("/update", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(402).send("cookies required");
  }

  const { username, password, NewPassword } = req.body;
  if (!username || !NewPassword || !password) {
    return res.status(402).json({
      message: "username, password, and NewPassword are required",
    });
  }

  try {
    const user = await UserModels.findOne({ username });

    if (!user) {
      return res.status(402).json({
        message: `User not found`,
      });
    }

    // Verify the password matches before attempting to update it
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Hash the new password before saving
    const hashedNewPassword = await bcrypt.hash(NewPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post("/votes", async (req, res) => {
  const { username, Party, Canditate, CanditateParty } = req.body;

  if (!username || !Party || !Canditate || !CanditateParty) {
    return res.status(402).json({
      message: "send propr details",
    });
  }
});

const CheckAuthenticaiton = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(402).json({
        message: "Unathorized Request",
      });
    }
    const decodedtoken = jwt.verify(token, SecretKey);

    const findedperson = await UserModels.findOne({
      username: decodedtoken.username,
    });

    if (!findedperson) {
      return res.status(402).json({
        message: "no user found",
      });
    }
    if (findedperson.admin === true) {
      next();
    } else {
      return res.status(402).json({
        message: `error no user authenticated`,
      });
    }
  } catch (error) {
    return res.status(402).json({
      message: error,
    });
  }
};

const UserAutheChecker = async(req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(402).json({
      message: "no token found",
    }).redirect("/post");
  }
  try {
    const token = jwt.decode(token , SecretKey)
    const FindAuth  = await UserModels.findOne({
      username: token.username,
      password: token.password,
      email: token.email,
      name: token.name,
    })
    if (!FindAuth) {
      return res.status(402).json({
        message:'No User found Invalid Token',
      }).redirect('/post');
    }
    if (FindAuth.admin === true) next();
    else res.status(403).send('Forbidden Access').redirect('/post');
  } catch (error) {
    return res.status(402).json({
      messages: `error founded`,
      error: error,
    });
  }
};

router.post("/add/party", async (req, res) => {
  const { partyname, canditiates } = req.body;
  if (!partyname || !canditiates) {
    return res.status(402).json({
      message: "send proper details",
    });
  }
  const token = req.cookies.token;
  if (!token) {
    return res.status(402).json({
      message: "no token found",
    });
  }
  const admin_found = jwt.decode(token, SecretKey);
  if (admin_found.role === "admin") {
    return res.status(402).json({
      message: `simple user cannnot done editing changes`,
    });
  }
  const NewPartyUpload = await new PartyModel({
    name: partyname,
    canditiates: canditiates,
  });
  await NewPartyUpload.save();
  return res.status(200).json({
    message: "party added succesfully",
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // must implement login logic

  try {
    const user = await UserModels.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const Jwttoken = jwt.verify({ username, password }, SecretKey);
    res.cookie("token", Jwttoken);

    return res.status(200).send("logged in successfully");
  } catch (error) {
    return res.status(501).json({
      message: "internal server error",
      problem: error,
    });
  }
});

router.get("/votes/update", (req, res) => {});

module.exports = router;
