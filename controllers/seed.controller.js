import path from "path";
import fs from "fs";

const uploadSeedImage = async (req, res) => {
  if (req.file) {

    const file = req.file;
    // Upload profile image
    const uploadDir = path.join("uploads", "seeds");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const filename = `temp${ext}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: `/uploads/seeds/${filename}`,
    });
  }
};

export default {
  uploadSeedImage,
};
