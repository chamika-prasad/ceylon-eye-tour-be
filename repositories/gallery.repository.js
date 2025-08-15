import { Gallery } from "../models/index.js";

// Get all gallery items
const getAllGallery = async () => {
  try {
    return await Gallery.findAll();
  } catch (error) {
    throw new Error(`Error fetching gallery items: ${error.message}`);
  }
};

// Get all approved gallery items
const getAllApprovedGallery = async () => {
  try {
    return await Gallery.findAll({
      where: { is_approved: true },
    });
  } catch (error) {
    throw new Error(`Error fetching approved gallery items: ${error.message}`);
  }
};

// Update is_approved by ID
const updateGalleryApproval = async (id, isApproved) => {
  try {
    const [updated] = await Gallery.update(
      { is_approved: isApproved },
      { where: { id } }
    );
    return updated > 0;
  } catch (error) {
    throw new Error(`Error updating gallery approval: ${error.message}`);
  }
};

export default {
  getAllGallery,
  updateGalleryApproval,
  getAllApprovedGallery,
};
