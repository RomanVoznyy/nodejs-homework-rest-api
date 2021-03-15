const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const { FolderName } = require('./constants');

const uploadDir = path.join(process.cwd(), FolderName.UPLOAD);
const publicDir = path.join(process.cwd(), FolderName.PUBLIC);
const avatarsDir = path.join(publicDir, FolderName.AVATARSSTORE);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
      return;
    }
    cb(null, false);
  },
});

const isAccessible = async path => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

module.exports = {
  uploadDir,
  publicDir,
  avatarsDir,
  upload,
  createFolderIsNotExist,
};
