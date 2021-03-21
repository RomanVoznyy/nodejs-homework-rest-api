const User = require('./schemes/schema-user');

const createUser = async ({
  name,
  email,
  password,
  subscription,
  verificationToken,
}) => {
  const newUser = User({
    name,
    email,
    password,
    subscription,
    verificationToken,
  });
  return await newUser.save();
};

const getUserById = async id => {
  return await User.findOne({ _id: id });
};

const getUserByEmail = async email => {
  return await User.findOne({ email });
};

const getUserByVerifyToken = async verificationToken => {
  return await User.findOne({ verificationToken });
};

const updateUser = async (id, body) => {
  return await User.findOneAndUpdate({ _id: id }, { ...body }, { new: true });
};

const updateToken = async (id, token) => {
  return await User.findOneAndUpdate({ _id: id }, { token });
};

const updateAvatar = async (id, avatar) => {
  return await User.findOneAndUpdate({ _id: id }, { avatar });
};

const updateVerificationToken = async (id, verificationToken) => {
  return await User.findOneAndUpdate({ _id: id }, { verificationToken });
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByVerifyToken,
  updateUser,
  updateToken,
  updateAvatar,
  updateVerificationToken,
};
