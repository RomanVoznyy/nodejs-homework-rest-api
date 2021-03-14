const db = require('../model/db');
const app = require('../app');
const {
  createFolderIsNotExist,
  uploadDir,
  avatarsDir,
} = require('../helpers/upload');

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, async () => {
    createFolderIsNotExist(uploadDir);
    createFolderIsNotExist(avatarsDir);
    console.log(`Server is running. Use our API on port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server is not running. Error: ${err.message}`);
  process.exit(1);
});
