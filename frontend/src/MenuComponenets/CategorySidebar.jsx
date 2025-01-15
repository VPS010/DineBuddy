import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const CategoryMenu = ({ categories, selectedCategory, setSelectedCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <>
      {/* Premium floating menu button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-[#2D6A4F] to-[#1A4731] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      >
        <Menu className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
      </button>

      {/* Modal overlay with sophisticated blur effect */}
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-end justify-center sm:items-center">
          <div 
            ref={menuRef}
            className="bg-[#FDFBF7] w-full sm:w-96 rounded-t-2xl sm:rounded-2xl max-h-[70vh] overflow-hidden shadow-xl border border-[#E8E3D9]"
          >
            {/* Premium modal header with gradient border */}
            <div className="relative">
              <div className="h-1 bg-gradient-to-r from-[#B8860B] via-[#2D6A4F] to-[#800000]" />
              <div className="flex items-center justify-between p-4 border-b border-[#E8E3D9]">
                <h2 className="text-lg font-semibold text-[#2C3539]">Menu Categories</h2>
                <button
                  onClick={toggleMenu}
                  className="text-[#666] hover:text-[#2C3539] transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Categories list with premium styling */}
            <div className="overflow-y-auto p-3">
              {categories.map(category => (
                <button
                  key={category}
                  className={`w-full px-4 py-3.5 rounded-xl text-left transition-all duration-200 mb-2 group ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#2D6A4F] to-[#1A4731] text-white shadow-md'
                      : 'hover:bg-[#E8E3D9]/30 text-[#2C3539]'
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="flex items-center">
                    <span className={`flex-1 font-medium ${
                      selectedCategory === category
                        ? ''
                        : 'group-hover:text-[#2D6A4F]'
                    }`}>
                      {category}
                    </span>
                    {selectedCategory === category && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Premium bottom gradient border */}
            <div className="h-1 bg-gradient-to-r from-[#800000] via-[#2D6A4F] to-[#B8860B]" />
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryMenu;