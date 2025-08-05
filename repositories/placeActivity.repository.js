import { PlaceActivity, Place, Activity } from "./../models/index.js";

const bulkInsert = async (records) => {
  return await PlaceActivity.bulkCreate(records);
};

const fetchGroupedByPlace = async () => {
  const places = await Place.findAll({
    include: [
      {
        model: Activity,
        as: "Activities",
        through: {
          attributes: ["description", "price", "image_url", "created_at"],
        },
      },
    ],
  });

  // Transform the data to match your structure
  const result = places.map((place) => ({
    placeDetails: {
      id: place.id,
      name: place.name,
      location: place.location,
      longitude: place.longitude,
      latitude: place.latitude,
      image_url: place.image_url,
    },
    activities: place.Activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      image_url: activity.image_url,
      description: activity.PlaceActivity.description,
      price: activity.PlaceActivity.price,
      image_url_custom: activity.PlaceActivity.image_url,
      created_at: activity.PlaceActivity.created_at,
    })),
  }));

  return result;
};

const update = async (place_id, activity_id, updatedData) => {
  console.log("Updating PlaceActivity:", place_id, activity_id, updatedData);
  
  const [updatedCount] = await PlaceActivity.update(updatedData, {
    where: { place_id, activity_id },
  });

  return updatedCount > 0;
};

const remove = async (place_id, activity_id) => {
  const deletedCount = await PlaceActivity.destroy({
    where: { place_id, activity_id },
  });

  return deletedCount > 0;
};

export default { bulkInsert, fetchGroupedByPlace, update, remove };
