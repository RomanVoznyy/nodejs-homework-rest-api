const User = require('./schemes/schema-user');

const createUser = async ({ name, email, password, subscription }) => {
  const newUser = User({ name, email, password, subscription });
  return await newUser.save();
};

const getUserById = async id => {
  return await User.findOne({ _id: id });
};

const getUserByEmail = async email => {
  return await User.findOne({ email });
};

const updateUser = async (id, body) => {
  return await User.findOneAndUpdate({ _id: id }, { ...body }, { new: true });
};

const updateToken = async (id, token) => {
  return await User.findOneAndUpdate({ _id: id }, { token });
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  updateToken,
};
