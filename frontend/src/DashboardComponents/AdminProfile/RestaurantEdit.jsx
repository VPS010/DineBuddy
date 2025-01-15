import React, { useState } from "react";
import { Loader2 } from "lucide-react";

const RestaurantEdit = ({
  restaurant,
  isEditing,
  setIsEditing,
  loading,
  onSubmit,
}) => {
  const [restaurantFormData, setRestaurantFormData] = useState({
    ...restaurant,
  });

  const handleRestaurantInputChange = (e) => {
    setRestaurantFormData({
      ...restaurantFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBusinessHourChange = (day, value) => {
    setRestaurantFormData({
      ...restaurantFormData,
      businessHours: {
        ...restaurantFormData.businessHours,
        [day]: value,
      },
    });
  };

  return (
    <div className="bg-green-50 rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-900">
          Restaurant Details
        </h2>
      </div>

      {!isEditing ? (
        <div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-green-700">
                  Restaurant Name
                </label>
                <p className="text-gray-800">{restaurant.name}</p>
              </div>
              <div>
                <label className="text-sm text-green-700">Address</label>
                <p className="text-gray-800">{restaurant.address}</p>
              </div>
              <div>
                <label className="text-sm text-green-700">Contact</label>
                <p className="text-gray-800">{restaurant.contact}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-green-700">Business Hours</label>
                {Object.entries(restaurant.businessHours).map(
                  ([day, hours]) => (
                    <p key={day} className="text-gray-800">
                      <span className="font-medium">{day}:</span> {hours}
                    </p>
                  )
                )}
              </div>
              <div>
                <label className="text-sm text-green-700">Member Since</label>
                <p className="text-gray-800">
                  {new Date(restaurant.memberSince).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              Edit Restaurant
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => onSubmit(e, restaurantFormData)}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Restaurant Name</label>
                <input
                  type="text"
                  name="name"
                  value={restaurantFormData.name}
                  onChange={handleRestaurantInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Address</label>
                <input
                  type="text"
                  name="address"
                  value={restaurantFormData.address}
                  onChange={handleRestaurantInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={restaurantFormData.contact}
                  onChange={handleRestaurantInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Business Hours</label>
                {Object.entries(restaurantFormData.businessHours).map(
                  ([day, hours]) => (
                    <div key={day} className="mt-2">
                      <label className="text-xs text-gray-500">{day}</label>
                      <input
                        type="text"
                        value={hours}
                        onChange={(e) =>
                          handleBusinessHourChange(day, e.target.value)
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setRestaurantFormData({ ...restaurant });
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RestaurantEdit;
