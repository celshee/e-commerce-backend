const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const userRepo = require("../repositories/user.repository");

exports.register = async (email, password) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("USER_ALREADY_EXISTS");

  const hash = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  await userRepo.createUser(userId, email, hash);

  return { userId };
};

exports.login = async (email, password) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );

  return { token, userId: user.id };
};