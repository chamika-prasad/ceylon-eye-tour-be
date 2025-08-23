import customizePackagePlaceService from "../services/customizePackagePlace.service.js";

const updateCustomizePackagePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const { sortOrder, dayNo, description } = req.body;

    const customizePackagePlace =
      await customizePackagePlaceService.getCustomizePackagePlaceById(id);
    if (!customizePackagePlace) {
      return res
        .status(404)
        .json({ success: false, message: "CustomizePackagePlace not found" });
    }

    const result =
      await customizePackagePlaceService.updateCustomizePackagePlace(id, {
        sortOrder,
        dayNo,
        description,
      });

    return res.status(200).json({
      success: true,
      message: "CustomizePackagePlace updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  updateCustomizePackagePlace,
};
