import React, { useState, useRef } from 'react';
import { Camera, X, Check, Loader2 } from 'lucide-react';



const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState({
    name: 'John Smith',
    email: 'john.smith@serveit.com',
    phone: '+1 (555) 123-4567',
    role: 'Restaurant Admin',
    dateJoined: 'January 15, 2024',
    avatar: '/api/placeholder/150/150'
  });

  const [formData, setFormData] = useState({
    ...profile,
    password: '',
    confirmPassword: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProfile({
      ...profile,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
    
    if (previewImage) {
      setProfile(prev => ({...prev, avatar: previewImage}));
    }
    
    setSuccessMessage('Profile updated successfully!');
    setLoading(false);
    setIsEditing(false);
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setFormData({
      ...profile,
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-900 mb-8">Admin Profile</h1>
          
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
              <Check className="w-5 h-5 mr-2" />
              {successMessage}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile View */}
            {!isEditing && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gold-300"
                  />
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
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
                  <div>
                    <label className="text-sm text-gray-500">Member Since</label>
                    <p className="text-gray-800">{profile.dateJoined}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}

            {/* Edit Form */}
            {isEditing && (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
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
                      'Save Changes'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Restaurant Info Card */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Restaurant Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-green-700">Restaurant Name</label>
                  <p className="text-gray-800">ServeIt Downtown</p>
                </div>
                <div>
                  <label className="text-sm text-green-700">Location</label>
                  <p className="text-gray-800">123 Restaurant Ave, Foodie City</p>
                </div>
                <div>
                  <label className="text-sm text-green-700">Business Hours</label>
                  <p className="text-gray-800">Mon-Sun: 11:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;