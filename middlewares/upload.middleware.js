import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() }); // keep files in memory

export default upload;