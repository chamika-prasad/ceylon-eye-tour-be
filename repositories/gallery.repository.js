import { Gallery,User } from "../models/index.js";

// Get all gallery items
const getAllGallery = async () => {
  try {
    return await Gallery.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: ["name"],
        },
      ],
    });
  } catch (error) {
    throw new Error(`Error fetching gallery items: ${error.message}`);
  }
};

// Get all approved gallery items
const getAllApprovedGallery = async () => {
  try {
    return await Gallery.findAll({
      where: { is_approved: true },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["name"],
        },
      ],
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

// Add a new gallery item
const addGalleryItem = async (galleryData) => {
  try {
    return await Gallery.create(galleryData);
  } catch (error) {
    throw new Error(`Error adding gallery item: ${error.message}`);
  }
};

// Delete a gallery item by ID
const deleteGalleryItemById = async (id) => {
  try {
    const deleted = await Gallery.destroy({ where: { id } });
    return deleted > 0;
  } catch (error) {
    throw new Error(`Error deleting gallery item: ${error.message}`);
  }
};

// Get a gallery item by ID
const getGalleryItemById = async (id) => {
  try {
    return await Gallery.findByPk(id);
  } catch (error) {
    throw new Error(`Error fetching gallery item by ID: ${error.message}`);
  }
};

export default {
  getAllGallery,
  updateGalleryApproval,
  getAllApprovedGallery,
  addGalleryItem,
  deleteGalleryItemById,
  getGalleryItemById,
};
