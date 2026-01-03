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

    // const sameSortOrderPlace =
    //   await customizePackagePlaceService.getCustomizePackagePlaceByPackageIdAndSortOrder(
    //     customizePackagePlace.customize_package_id,
    //     sortOrder
    //   );

    // if (sameSortOrderPlace) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Sort order number already taken" });
    // }

    var isSortOrderCanUpdate =
      !customizePackagePlace.sort_order ||
      (sortOrder &&
        Number(sortOrder) !== Number(customizePackagePlace.sort_order));

    var isDayNoCanUpdate =
      !customizePackagePlace.day_no ||
      (dayNo && Number(dayNo) !== Number(customizePackagePlace.day_no));

    var isDescriptionCanUpdate =
      !customizePackagePlace.description ||
      (description && description !== customizePackagePlace.description);

    const updateData = {
      ...(isSortOrderCanUpdate && { sort_order: sortOrder }),
      ...(isDayNoCanUpdate && { day_no: dayNo }),
      ...(isDescriptionCanUpdate && { description }),
    };

    if (isSortOrderCanUpdate || isDayNoCanUpdate || isDescriptionCanUpdate) {
      // const result =
        // await customizePackagePlaceService.updateCustomizePackagePlace(id, {
        //   sortOrder,
        //   dayNo,
        //   description,
        // });

        await customizePackagePlaceService.updateCustomizePackagePlace(
          id,
          updateData
        );

      return res.status(200).json({
        success: true,
        message: "CustomizePackagePlace updated successfully",
        // data: result,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Nothing to update",
      });
    }
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
