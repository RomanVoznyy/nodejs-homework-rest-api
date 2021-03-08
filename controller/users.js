const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET_WORD;
const userModel = require('../model/model-user');
const { StatusCode } = require('../helpers/constants');

const registerUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModel.getUserByEmail(email);
    if (user) {
      return res.status(StatusCode.CONFLICT).json({
        status: 'error',
        code: StatusCode.CONFLICT,
        data: 'conflict',
        message: 'Email is already used',
      });
    }

    const newUser = await userModel.createUser(req.body);
    return res.status(StatusCode.CREATED).json({
      status: 'success',
      code: StatusCode.CREATED,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.getUserByEmail(email);

    if (!user || !(await user.isValidPassword(password))) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        status: 'error',
        code: StatusCode.UNAUTHORIZED,
        data: 'unautorized',
        message: 'Wrong email or password',
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: '2h',
    });

    await userModel.updateToken(user._id, token);

    return res.status(StatusCode.SUCCESS).json({
      status: 'success',
      code: StatusCode.SUCCESS,
      data: {
        token,
      },
      message: 'user is successfully logged in',
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await userModel.updateToken(req.user.id, null);
    return res.status(StatusCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await userModel.getUserById(req.user.id);

    if (!user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        status: 'error',
        code: StatusCode.UNAUTHORIZED,
        data: 'unautorized',
        message: 'Not authorized',
      });
    }

    return res.status(StatusCode.SUCCESS).json({
      status: 'success',
      code: StatusCode.SUCCESS,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
      message: 'this is current user',
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.updateUser(userId, req.body);

    if (!user) {
      return res.status(StatusCode.BAD_REQUEST).json({
        status: 'error',
        code: StatusCode.BAD_REQUEST,
        data: 'Bad request',
        message: 'Bad request',
      });
    }

    return res.status(StatusCode.SUCCESS).json({
      status: 'success',
      code: StatusCode.SUCCES,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateSubscription,
};
