import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import AdminEdit from "./AdminEdit";
import RestaurantEdit from "./RestaurantEdit";

const AdminProfile = () => {
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: "/api/placeholder/150/150",
  });

  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    contact: "",
    description: "",
    businessHours: {},
    memberSince: "",
  });

  const token = localStorage.getItem("authorization");

  const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: token,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const adminResponse = await api.get("/api/v1/admin/profile");
        const adminData = adminResponse.data.admin;
        setProfile({
          name: adminData.name,
          email: adminData.email,
          phone: adminData.phone,
          role: "Restaurant Admin",
          avatar: adminData.avatar || "/api/placeholder/150/150",
        });

        const restaurantResponse = await api.get("/api/v1/admin/restaurant");
        const restaurantData = restaurantResponse.data.restaurant;
        setRestaurant({
          name: restaurantData.name,
          address: restaurantData.address,
          contact: restaurantData.contact,
          description: restaurantData.description,
          businessHours: restaurantData.businessHours,
          memberSince: restaurantData.memberSince,
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdminSubmit = async (e, formData) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Match the server's expected fields
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        // Only include password if it's provided
        ...(formData.password && { password: formData.password }),
      };

      // Validate that at least one field is provided
      if (!dataToSend.name && !dataToSend.email && !dataToSend.password) {
        setError("At least one field (name, email, password) is required");
        setLoading(false);
        return;
      }

      // Handle avatar separately if needed
      if (previewImage) {
        const formDataWithAvatar = new FormData();
        if (dataToSend.name) formDataWithAvatar.append("name", dataToSend.name);
        if (dataToSend.email)
          formDataWithAvatar.append("email", dataToSend.email);
        if (dataToSend.password)
          formDataWithAvatar.append("password", dataToSend.password);

        const avatarFile = await fetch(previewImage).then((r) => r.blob());
        formDataWithAvatar.append("avatar", avatarFile);

        const response = await api.put(
          "/api/v1/admin/profile",
          formDataWithAvatar,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setProfile({
          ...profile,
          ...response.data.admin,
        });
      } else {
        // If no avatar, send JSON data
        const response = await api.put("/api/v1/admin/profile", dataToSend, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setProfile({
          ...profile,
          ...response.data.admin,
        });
      }

      setSuccessMessage("Admin profile updated successfully!");
      setIsEditingAdmin(false);
    } catch (err) {
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.error || "Failed to update admin profile");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
    }
  };

  const handleRestaurantSubmit = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put("/api/v1/admin/restaurant", formData);

      setRestaurant(response.data.restaurant);
      setSuccessMessage("Restaurant details updated successfully!");
      setIsEditingRestaurant(false);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to update restaurant details"
      );
      console.error("Error updating restaurant details:", err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
    }
  };

  if (loading && !profile.name) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <div>
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
            <span className="w-5 h-5 mr-2">✓</span>
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
            <span className="w-5 h-5 mr-2">⚠</span>
            {error}
          </div>
        )}
      </div>
      <div className="max-w-6xl justify-center md:flex bg-gray-50 rounded-md mx-auto p-6">
        <AdminEdit
          profile={profile}
          isEditing={isEditingAdmin}
          setIsEditing={setIsEditingAdmin}
          loading={loading}
          onSubmit={handleAdminSubmit}
          previewImage={previewImage}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
        />

        <RestaurantEdit
          restaurant={restaurant}
          isEditing={isEditingRestaurant}
          setIsEditing={setIsEditingRestaurant}
          loading={loading}
          onSubmit={handleRestaurantSubmit}
        />
      </div>
    </div>
  );
};

export default AdminProfile;
