import galleryRepository from "../repositories/gallery.repository.js";

const getAllGallery = async () => {
  return await galleryRepository.getAllGallery();
};

const getAllApprovedGallery = async () => {
  return await galleryRepository.getAllApprovedGallery();
};

const updateGalleryApproval = async (id, isApproved) => {
  return await galleryRepository.updateGalleryApproval(id, isApproved);
};

const addGalleryItem = async (galleryItem) => {
  return await galleryRepository.addGalleryItem(galleryItem);
};

const deleteGalleryItemById = async (id) => {
  return await galleryRepository.deleteGalleryItemById(id);
};

export default {
  getAllGallery,
  updateGalleryApproval,
  getAllApprovedGallery,
  addGalleryItem,
  deleteGalleryItemById,
};
