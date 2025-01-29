import React, { useRef, useEffect } from 'react';
import { X, Camera, Save } from 'lucide-react';

const MenuItemModal = ({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onImageUpload,
  onSubmit,
  selectedItem,
  previewImage,
  loading,
  categories
}) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const spiceLevels = ['Mild', 'Medium', 'Spicy', 'Extra Spicy'];
  const dietaryOptions = ['Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Vegan'];
  const popularityTags = ['Best Seller', 'Customer Favorite', 'Trending Now', 'New Arrival'];

  if (!isOpen) return null;

  const handleDietaryChange = (option) => {
    const currentDietary = formData.dietary || [];
    const updatedDietary = currentDietary.includes(option)
      ? currentDietary.filter(item => item !== option)
      : [...currentDietary, option];
    onInputChange({ target: { name: 'dietary', value: updatedDietary } });
  };

  const handlePopularityChange = (tag) => {
    const currentTags = formData.popularity || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(item => item !== tag)
      : [...currentTags, tag];
    onInputChange({ target: { name: 'popularity', value: updatedTags } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src={previewImage || formData.image}
                  alt="Menu item"
                  className="w-28 h-28 rounded-lg object-cover"
                />
                <label className="absolute bottom-2 right-2 p-1.5 bg-white rounded-full shadow-lg cursor-pointer">
                  <Camera className="w-4 h-4 text-gray-600" />
                  <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  className="w-full p-2 border rounded-lg mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={onInputChange}
                  className="w-full p-2 border rounded-lg mt-1"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={onInputChange}
                  min="0"
                  className="w-full p-2 border rounded-lg mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Spice Level</label>
                <select
                  name="spiceLevel"
                  value={formData.spiceLevel}
                  onChange={onInputChange}
                  className="w-full p-2 border rounded-lg mt-1"
                >
                  {spiceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows="2"
                className="w-full p-2 border rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Dietary Options</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {dietaryOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleDietaryChange(option)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.dietary?.includes(option)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Popularity Tags</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {popularityTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handlePopularityChange(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.popularity?.includes(tag)
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={formData.isVeg}
                  onChange={e => onInputChange({
                    target: { name: 'isVeg', value: e.target.checked }
                  })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Vegetarian</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={e => onInputChange({
                    target: { name: 'isAvailable', value: e.target.checked }
                  })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Available</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;