import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuHeader from "./Header";
import MenuItemCard from "./ItemCard";
import MenuItemModal from "./ItemModal";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authorization");
  const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: token,
    },
  });

  const initialFormData = {
    name: "",
    category: "Mains",
    price: "",
    description: "",
    dietary: [],
    isVeg: false,
    spiceLevel: "Medium",
    popularity: [],
    isAvailable: true,
    image: "/api/placeholder/400/400",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/v1/admin/menu");
        setMenuItems(response.data.menuItems);
        setError(null);
      } catch (err) {
        setError("Failed to fetch menu items");
        console.error("Error fetching menu items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
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
        console.error("Error processing image:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate image size after compression
      if (formData.image && formData.image.length > 1024 * 1024 * 2) {
        // 2MB limit after compression
        throw new Error(
          "Compressed image is still too large. Please use a smaller image."
        );
      }

      if (selectedItem) {
        // Update existing menu item
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
        // Add new menu item
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
      console.error("Error submitting menu item:", err);
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
      console.error("Error toggling status:", err);
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
        console.error("Error deleting menu item:", err);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormData(initialFormData);
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
        />

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

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
        />
      </div>
    </div>
  );
};

export default MenuManagement;
