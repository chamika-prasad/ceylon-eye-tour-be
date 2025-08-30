import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const uploadFile = async (uploadDir, file) => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, file.buffer);
  return filename;
};

const removeFile = async(imagePath) => {
  const fullPath = path.join(process.cwd(), imagePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

export default {
  uploadFile,
  removeFile,
};
