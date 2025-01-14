import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Camera, Save } from 'lucide-react';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Classic Burger',
      category: 'Mains',
      price: 14.99,
      description: 'Juicy beef patty with fresh vegetables',
      image: '/api/placeholder/80/80',
      enabled: true,
      allergens: 'Gluten, Dairy'
    },
    {
      id: 2,
      name: 'Caesar Salad',
      category: 'Appetizers',
      price: 9.99,
      description: 'Crisp romaine lettuce with parmesan',
      image: '/api/placeholder/80/80',
      enabled: true,
      allergens: 'Dairy, Eggs'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const initialFormData = {
    name: '',
    category: 'Appetizers',
    price: '',
    description: '',
    allergens: '',
    enabled: true,
    image: '/api/placeholder/80/80'
  };

  const [formData, setFormData] = useState(initialFormData);
  const categories = ['Appetizers', 'Mains', 'Desserts', 'Beverages', 'Sides'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (selectedItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === selectedItem.id ? { ...formData, id: item.id } : item
      ));
    } else {
      setMenuItems(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    
    handleCloseModal();
    setLoading(false);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setMenuItems(prev => prev.filter(item => item.id !== itemToDelete.id));
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormData(initialFormData);
    setPreviewImage(null);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'enabled' && item.enabled) ||
                         (activeFilter === 'disabled' && !item.enabled);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Item
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg ${activeFilter === 'all' ? 'bg-gray-200' : 'bg-gray-100'}`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveFilter('enabled')}
              className={`px-4 py-2 rounded-lg ${activeFilter === 'enabled' ? 'bg-green-200' : 'bg-gray-100'}`}
            >
              Enabled
            </button>
            <button
              onClick={() => setActiveFilter('disabled')}
              className={`px-4 py-2 rounded-lg ${activeFilter === 'disabled' ? 'bg-red-200' : 'bg-gray-100'}`}
            >
              Disabled
            </button>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-lg font-medium">${item.price}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    item.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className={`p-2 rounded-lg ${
                      item.enabled ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {item.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </h2>
                  <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={previewImage || formData.image}
                        alt="Menu item"
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                      <label className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer">
                        <Camera className="w-5 h-5 text-gray-600" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="enabled"
                          checked={formData.enabled}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <span>Enabled</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergens
                    </label>
                    <input
                      type="text"
                      name="allergens"
                      value={formData.allergens}
                      onChange={handleInputChange}
                      placeholder="e.g., Nuts, Dairy, Gluten"
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete <strong>{itemToDelete?.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
