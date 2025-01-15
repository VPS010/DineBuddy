import React, { useState, useRef } from "react";
import { Camera, X, Check, Loader2 } from "lucide-react";

const AdminProfile = () => {
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "John Smith",
    email: "john.smith@serveit.com",
    phone: "+1 (555) 123-4567",
    role: "Restaurant Admin",
    avatar: "/api/placeholder/150/150",
  });

  const [restaurant, setRestaurant] = useState({
    name: "ServeIt Downtown",
    address: "delhi-6 ram nagar",
    contact: "987-654-3210",
    description: "A newly updated description.",
    businessHours: {
      Monday: "9:00 AM - 8:00 PM",
      Tuesday: "9:00 AM - 8:00 PM",
      Friday: "10:00 AM - 11:00 PM",
    },
    memberSince: "2025-01-15T11:22:10.044Z",
  });

  const [adminFormData, setAdminFormData] = useState({
    ...profile,
    password: "",
    confirmPassword: "",
  });

  const [restaurantFormData, setRestaurantFormData] = useState({
    ...restaurant,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdminInputChange = (e) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setProfile({
      ...profile,
      name: adminFormData.name,
      email: adminFormData.email,
      phone: adminFormData.phone,
    });

    if (previewImage) {
      setProfile((prev) => ({ ...prev, avatar: previewImage }));
    }

    setSuccessMessage("Admin profile updated successfully!");
    setLoading(false);
    setIsEditingAdmin(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setRestaurant(restaurantFormData);

    setSuccessMessage("Restaurant details updated successfully!");
    setLoading(false);
    setIsEditingRestaurant(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-4xl md:flex bg-gray-50 rounded-md mx-auto p-6">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Admin Profile Section */}
        <div className="bg-white  rounded-lg shadow-lg p-8 mx-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-900">Admin Profile</h2>
          </div>

          {!isEditingAdmin ? (
            <div className="grid gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gold-300"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {profile.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-maroon-100 text-maroon-800 rounded-full text-sm">
                      {profile.role}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-gray-800">{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="text-gray-800">{profile.phone}</p>
                  </div>
                </div>
              </div>
              <div>
                {!isEditingAdmin && (
                  <button
                    onClick={() => setIsEditingAdmin(true)}
                    className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={previewImage || profile.avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-gold-300"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-green-700 text-white rounded-full hover:bg-green-800"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={adminFormData.name}
                        onChange={handleAdminInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={adminFormData.email}
                        onChange={handleAdminInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={adminFormData.phone}
                        onChange={handleAdminInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={adminFormData.password}
                      onChange={handleAdminInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={adminFormData.confirmPassword}
                      onChange={handleAdminInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
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
                    setIsEditingAdmin(false);
                    setPreviewImage(null);
                    setAdminFormData({
                      ...profile,
                      password: "",
                      confirmPassword: "",
                    });
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Restaurant Details Section */}
        <div className="bg-green-50 rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-900">
              Restaurant Details
            </h2>
          </div>

          {!isEditingRestaurant ? (
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
                  <label className="text-sm text-green-700">
                    Business Hours
                  </label>
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
            {!isEditingRestaurant && (
              <button
                onClick={() => setIsEditingRestaurant(true)}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
              >
                Edit Restaurant
              </button>
            )}
            </div>
            </div>
          ) : (
            <form onSubmit={handleRestaurantSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      Restaurant Name
                    </label>
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
                    <label className="text-sm text-gray-500">
                      Business Hours
                    </label>
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
                  {" "}
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
                    setIsEditingRestaurant(false);
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
      </div>
    </div>
  );
};

export default AdminProfile;
Camera