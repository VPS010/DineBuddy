import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuHeader from "./Header";
import MenuItemCard from "./ItemCard";
import MenuItemModal from "./ItemModal";
import CategoryDialog from "./CategoryDialog";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);


  const token = localStorage.getItem("authorization");
  const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: token,
    },
  });

  const initialFormData = {
    name: "",
    category: "", // Will be set to first category once loaded
    price: "",
    description: "",
    dietary: [],
    isVeg: false,
    spiceLevel: "Medium",
    popularity: [],
    isAvailable: true,
    image: "/api/placeholder/400/400",
  };


  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/v1/admin/menu/categories");
        setCategories(response.data.categories);
        // Update initial form data with first category
        if (response.data.categories.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: response.data.categories[0],
          }));
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch categories");
        // console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch menu items
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/v1/admin/menu/categories");
        setCategories(response.data.categories);
        // Initialize form data only after categories are loaded
        if (response.data.categories.length > 0) {
          setFormData({
            name: "",
            category: response.data.categories[0], // Set first category as default
            price: "",
            description: "",
            dietary: [],
            isVeg: false,
            spiceLevel: "Medium",
            popularity: [],
            isAvailable: true,
            image: "/api/placeholder/400/400",
          });
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Compress image to JPEG with 0.7 quality
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedDataUrl);
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Check file size before compression (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          setError("Image size should be less than 5MB");
          return;
        }

        const compressedImage = await compressImage(file);
        setPreviewImage(compressedImage);
        setFormData((prev) => ({ ...prev, image: compressedImage }));
        setError(null);
      } catch (err) {
        setError("Error processing image. Please try again.");
        // console.error("Error processing image:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Frontend validation
    const requiredFields = {
      name: "Name",
      category: "Category",
      price: "Price",
      description: "Description",
      spiceLevel: "Spice Level"
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      setError(`Required fields missing: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      // Validate image size after compression
      if (formData.image && formData.image.length > 1024 * 1024 * 2) {
        throw new Error("Compressed image is still too large. Please use a smaller image.");
      }

      if (selectedItem) {
        const response = await api.put(
          `/api/v1/admin/menu/${selectedItem._id}`,
          formData
        );
        setMenuItems((prev) =>
          prev.map((item) =>
            item._id === selectedItem._id ? response.data.menuItem : item
          )
        );
      } else {
        const response = await api.post("/api/v1/admin/menu", formData);
        setMenuItems((prev) => [...prev, response.data.menuItem]);
      }
      handleCloseModal();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        (selectedItem
          ? "Failed to update menu item"
          : "Failed to add menu item");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      const itemToUpdate = menuItems.find((item) => item._id === id);
      const response = await api.put(`/api/v1/admin/menu/${id}`, {
        ...itemToUpdate,
        isAvailable: !itemToUpdate.isAvailable,
      });

      setMenuItems((prev) =>
        prev.map((item) => (item._id === id ? response.data.menuItem : item))
      );
      setError(null);
    } catch (err) {
      setError("Failed to update item status");
      // console.error("Error toggling status:", err);
    }
  };

  const handleDelete = async (itemToDelete) => {
    if (
      window.confirm(`Are you sure you want to delete ${itemToDelete.name}?`)
    ) {
      try {
        await api.delete(`/api/v1/admin/menu/${itemToDelete._id}`);
        setMenuItems((prev) =>
          prev.filter((item) => item._id !== itemToDelete._id)
        );
        setError(null);
      } catch (err) {
        setError("Failed to delete menu item");
        // console.error("Error deleting menu item:", err);
      }
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await api.post("/api/v1/admin/menu/categories", {
        categories: [newCategory],
      });
      setCategories(response.data.categories);
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to add category");
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      const response = await api.delete(
        `/api/v1/admin/menu/categories/${encodeURIComponent(category)}`
      );
      setCategories(response.data.categories);
    } catch (err) {
      // Properly extract the error message from the response
      const errorMessage =
        err.response?.data?.error || "Failed to delete category";
      throw new Error(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    // Reset form to initial state with first category
    if (categories.length > 0) {
      setFormData({
        name: "",
        category: categories[0],
        price: "",
        description: "",
        dietary: [],
        isVeg: false,
        spiceLevel: "Medium",
        popularity: [],
        isAvailable: true,
        image: "/api/placeholder/400/400",
      });
    }
    setPreviewImage(null);
  };

  const filteredItems = menuItems.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.dietary?.some((diet) => diet.toLowerCase().includes(searchLower));

    switch (activeFilter) {
      case "available":
        return matchesSearch && item.isAvailable;
      case "unavailable":
        return matchesSearch && !item.isAvailable;
      case "veg":
        return matchesSearch && item.isVeg;
      case "nonveg":
        return matchesSearch && !item.isVeg;
      case "bestseller":
        return matchesSearch && item.popularity?.includes("Best Seller");
      case "trending":
        return matchesSearch && item.popularity?.includes("Trending Now");
      default:
        return matchesSearch;
    }
  });

  const getEmptyStateMessage = () => {
    if (categories.length === 0) {
      return (
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to Menu Management!
            </h2>
            <p className="text-gray-600 mb-8">
              To get started with your menu, you'll need to:
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <ol className="list-decimal list-inside text-left space-y-4">
                <li className="text-gray-700">
                  First, create some menu categories (e.g., Appetizers, Main
                  Course, Desserts)
                </li>
                <li className="text-gray-700">
                  Then add menu items to your categories
                </li>
              </ol>
            </div>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Category
            </button>
          </div>
        </div>
      );
    }

    if (menuItems.length === 0) {
      return (
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Add Menu Items
            </h2>
            <p className="text-gray-600 mb-8">
              You have categories set up. Now it's time to add some delicious
              items to your menu!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Menu Item
            </button>
          </div>
        </div>
      );
    }

    if (searchTerm || activeFilter !== "all") {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No menu items found matching your criteria.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <MenuHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddNew={() => setIsModalOpen(true)}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAddNewCategory={() => setIsCategoryModalOpen(true)}
        />

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {getEmptyStateMessage() || (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && filteredItems.length > 0
              ? filteredItems.map((item) => (
                  <MenuItemCard
                    key={item._id}
                    item={item}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                  />
                ))
              : !loading && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No menu items found matching your criteria.
                    </p>
                  </div>
                )}
          </div>
        )}

        <CategoryDialog
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        <MenuItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          formData={formData}
          onInputChange={handleInputChange}
          onImageUpload={handleImageUpload}
          onSubmit={handleSubmit}
          selectedItem={selectedItem}
          previewImage={previewImage}
          loading={loading}
          categories={categories} // Pass categories to modal
        />
      </div>
    </div>
  );
};

export default MenuManagement;
