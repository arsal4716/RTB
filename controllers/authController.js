const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateEmail, validatePassword } = require("../utils/validate");
const { successResponse, errorResponse } = require("../utils/response");
const { appendFormDataToSheet } = require("../Helper/googleSheet");
const User = require("../models/User");
const publisherIps = require("../config/allowedIps");

const normalizeIp = (ip) =>
  ip.startsWith("::ffff:") ? ip.replace("::ffff:", "") : ip;
const normalize = (str) => str.trim().toLowerCase();

const IP_CHECK_EXEMPT_PUBLISHERS = [
  "Golden Spruce",
  "MXZ",
  "BMI",
  "Workerz LLC",
  "Assured",
  "hlg",
  "Quativa",
  "RNT",
  "Actual Sales",
  "NXTBPO"
].map(pub => normalize(pub));

const registerUser = async (req, res, next) => {
  try {
    const { agentName, email, password, publisherName } = req.body;
    const validPublishers = Object.keys(publisherIps);

    const matchedPublisher = validPublishers.find(
      (pub) => normalize(pub) === normalize(publisherName)
    );

    if (!matchedPublisher) {
      const hint = validPublishers.find((pub) =>
        normalize(pub).startsWith(normalize(publisherName))
      );
      return errorResponse(
        res,
        hint
          ? `Invalid publisher name. Did you mean "${hint}"?`
          : "Invalid publisher name. Please enter a valid one."
      );
    }

    const normalizedPublisher = normalize(matchedPublisher);
    const clientIp = normalizeIp(req.clientIp);
    
    // Skip IP check for exempt publishers
    if (!IP_CHECK_EXEMPT_PUBLISHERS.includes(normalizedPublisher)) {
      const allowedIps = publisherIps[matchedPublisher] || [];
      console.log(`Received IP: ${clientIp}`);
      console.log(
        `Allowed IPs for publisher "${matchedPublisher}": ${allowedIps}`
      );

      if (!allowedIps.includes(clientIp)) {
        return errorResponse(
          res,
          `Registration restricted: Your IP (${clientIp}) is not authorized.`,
          403
        );
      }
    }

    if (!validateEmail(email)) {
      return errorResponse(res, "Invalid email format");
    }

    if (!validatePassword(password)) {
      return errorResponse(
        res,
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return errorResponse(res, "Email already exists.");
    }

    const existingAgentName = await User.findOne({ agentName });
    if (existingAgentName) {
      return errorResponse(res, "Username already taken.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      agentName,
      email,
      password: hashedPassword,
      publisherName: matchedPublisher,
      userAgent: req.userAgent,
      ipAddress: clientIp,
      publisherName: publisherName,
    });

    await newUser.save();
    await appendFormDataToSheet(newUser, "Register");

    successResponse(res, "User registered successfully.");
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, "Invalid credentials.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, "Invalid credentials.");

    const validPublishers = Object.keys(publisherIps);
    const matchedPublisher = validPublishers.find(
      (pub) => normalize(pub) === normalize(user.publisherName)
    );

    const normalizedPublisher = normalize(matchedPublisher);
    const clientIp = normalizeIp(req.clientIp);
    
    // Skip IP check for exempt publishers
    if (!IP_CHECK_EXEMPT_PUBLISHERS.includes(normalizedPublisher)) {
      const allowedIps = publisherIps[matchedPublisher] || [];
      console.log(`Received IP: ${clientIp}`);
      console.log(
        `Allowed IPs for publisher "${matchedPublisher}": ${allowedIps}`
      );

      if (!allowedIps.includes(clientIp)) {
        return errorResponse(
          res,
          `Login restricted: Your IP (${clientIp}) is not authorized.`,
          403
        );
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        agentName: user.agentName,
        publisherName: user.publisherName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "14h" }
    );

    successResponse(res, "Login successful", {
      token,
      agentName: user.agentName,
      publisherName: user.publisherName,
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = (req, res, next) => {
  try {
    successResponse(res, "Logout successful");
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, logoutUser };