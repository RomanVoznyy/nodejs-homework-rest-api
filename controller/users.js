const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const Jimp = require('jimp');
require('dotenv').config();
const secret = process.env.SECRET_WORD;
const userModel = require('../model/model-user');
const { StatusCode } = require('../helpers/constants');
const { createFolderIsNotExist, avatarsDir } = require('../helpers/upload');
const { FolderName } = require('../helpers/constants');

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
        avatar: newUser.avatar,
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
        avatar: user.avatar,
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

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const avatarURL = await saveAvatarToStatic(req, userId);

    const user = await userModel.updateAvatar(userId, avatarURL);

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
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

const saveAvatarToStatic = async (req, id) => {
  try {
    const { path: tempFullPath, originalname } = req.file;
    const newfileName = `${Date.now()}-${originalname}`;

    const img = await Jimp.read(tempFullPath);
    await img
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,
      )
      .writeAsync(tempFullPath);

    await createFolderIsNotExist(
      path.join(FolderName.PUBLIC, FolderName.AVATARSSTORE, id),
    );
    await fs.rename(
      tempFullPath,
      path.join(FolderName.PUBLIC, FolderName.AVATARSSTORE, id, newfileName),
    );
    const avatarUrl = path.normalize(path.join(id, newfileName));

    try {
      await fs.unlink(path.join(avatarsDir, req.user.avatar));
    } catch (error) {
      console.log(error);
    }

    return avatarUrl;
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
  updateAvatar,
};
