import React, { useState } from "react";
import { Camera, Loader2 } from "lucide-react";

const AdminEdit = ({
  profile,
  isEditing,
  setIsEditing,
  loading,
  onSubmit,
  previewImage,
  fileInputRef,
  handleImageUpload,
}) => {
  const [adminFormData, setAdminFormData] = useState({
    ...profile,
    password: "",
    confirmPassword: "",
  });

  const handleAdminInputChange = (e) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg  shadow-lg p-8 mx-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-900">Admin Profile</h2>
      </div>

      {!isEditing ? (
        <div className="grid gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <p className="w-28 bg-green-600 text-white h-28 font-mono text-6xl flex justify-center items-center  rounded-full object-cover border-4 border-gold-300">
                {profile.name[0]}
              </p>
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
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => onSubmit(e, adminFormData)}
          className="space-y-6"
        >
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
                  <p>{profile.phone}</p>
                  <p className="text-gray-500">(Can't be changed)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">New Password</label>
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
                setIsEditing(false);
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
  );
};

export default AdminEdit;
