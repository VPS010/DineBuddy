import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, AlertCircle, Search } from "lucide-react";

const CategoryDialog = ({
  isOpen,
  onClose,
  categories = [],
  onAddCategory,
  onDeleteCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const dialogRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        if (categoryToDelete) {
          setCategoryToDelete(null);
        } else {
          onClose();
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (categoryToDelete) {
          setCategoryToDelete(null);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose, categoryToDelete]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setNewCategory("");
      setSearchQuery("");
      setError("");
      setDeleteError("");
      setCategoryToDelete(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newCategory.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    if (categories.includes(newCategory.trim())) {
      setError("Category already exists");
      return;
    }

    try {
      await onAddCategory(newCategory.trim());
      setNewCategory("");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to add category");
    }
  };

  const handleDeleteClick = (category) => {
    setDeleteError("");
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await onDeleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    } catch (err) {
      if (err.message.includes("being used by menu items")) {
        setDeleteError(
          "This category cannot be deleted because it contains menu items. Please reassign or remove all items from this category first."
        );
      } else {
        setDeleteError(err.message || "Failed to delete category");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort categories
  const filteredCategories = [...categories]
    .filter((category) =>
      category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg w-full max-w-md p-6 relative"
      >
        {/* Delete Confirmation Modal */}
        {categoryToDelete && (
          <div className="absolute inset-0 bg-white rounded-lg p-6 z-10">
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Category?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete "{categoryToDelete}"? This
                action cannot be undone.
              </p>
              {deleteError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 w-full">
                  <p className="text-red-600 text-sm">{deleteError}</p>
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setCategoryToDelete(null);
                    setDeleteError("");
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Dialog Content */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        <div className="max-h-64 overflow-y-auto">
          <h3 className="font-medium text-gray-700 mb-2">
            Existing Categories
          </h3>
          {filteredCategories.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? "No categories found matching your search"
                : "No categories added yet"}
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredCategories.map((category) => (
                <li
                  key={category}
                  className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                >
                  <span>{category}</span>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDialog;
