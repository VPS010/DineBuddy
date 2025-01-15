
const menuItems = [
    {
      id: 1,
      name: "Grilled Salmon",
      category: "Main Course",
      price: 24.99,
      description: "Fresh Atlantic salmon grilled to perfection with herbs",
      ingredients: ["Salmon", "Herbs", "Lemon", "Olive Oil"],
      image: "/api/placeholder/300/200",
      dietary: ["Gluten-Free"],
      isVeg:true,
      customization: {
        spiceLevel: ["Mild", "Medium", "Spicy"],
        sides: ["Rice", "Vegetables", "Potatoes"]
      },
      popularity: 4.5
    },
    {
      id: 2,
      name: "Caesar Salad",
      category: "Appetizers",
      price: 18.99,
      description: "Classic Caesar salad with romaine lettuce and house-made dressing",
      ingredients: ["Romaine", "Croutons", "Parmesan", "Caesar Dressing"],
      image: "/api/placeholder/300/200",
      isVeg:fals,
      dietary: ["Vegetarian"],
      customization: {
        addOns: ["Chicken", "Shrimp", "Extra Cheese"]
      },
      popularity: 4.2
    },
    {
      id: 3,
      name: "Caesar Salad",
      category: "Appetizers",
      price: 17.99,
      description: "Classic Caesar salad with romaine lettuce and house-made dressing",
      ingredients: ["Romaine", "Croutons", "Parmesan", "Caesar Dressing"],
      image: "/api/placeholder/300/200",
      isVeg:true,
      dietary: ["Vegetarian"],
      customization: {
        addOns: ["Chicken", "Shrimp", "Extra Cheese"]
      },
      popularity: 4.2
    },
    {
      id: 4,
      name: "Caesar Salad",
      category: "Appetizers",
      price: 18.99,
      description: "Classic Caesar salad with romaine lettuce and house-made dressing",
      ingredients: ["Romaine", "Croutons", "Parmesan", "Caesar Dressing"],
      image: "/api/placeholder/300/200",
      isVeg:false,
      dietary: ["Vegetarian"],
      customization: {
        addOns: ["Chicken", "Shrimp", "Extra Cheese"]
      },
      popularity: 4.2
    }
  ];