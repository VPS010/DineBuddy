import React, { useState, useRef } from 'react';
import AdminEdit from './AdminEdit';
import RestaurantEdit from './RestaurantEdit';
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
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setProfile({
      ...profile,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });

    if (previewImage) {
      setProfile((prev) => ({ ...prev, avatar: previewImage }));
    }

    setSuccessMessage("Admin profile updated successfully!");
    setLoading(false);
    setIsEditingAdmin(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleRestaurantSubmit = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setRestaurant(formData);

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
            <span className="w-5 h-5 mr-2">✓</span>
            {successMessage}
          </div>
        )}

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