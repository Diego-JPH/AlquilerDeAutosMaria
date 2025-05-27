const fs = require('fs');
const path = require('path');

const saveImage = (file) => {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = Date.now() + '-' + file.originalname;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, file.buffer);

  return `/uploads/${fileName}`; // Ruta pública para servir desde el frontend
};

module.exports = { saveImage };
