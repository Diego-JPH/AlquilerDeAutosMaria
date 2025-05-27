const multer = require('multer');

const storage = multer.memoryStorage(); // Guarda en memoria para luego mover con fs
const upload = multer({ storage });

module.exports = upload;
