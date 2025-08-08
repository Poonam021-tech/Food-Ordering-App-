import React from 'react';

const categories = [
  { value: 'all', label: 'All Categories', emoji: '🍽️' },
  { value: 'appetizer', label: 'Appetizers', emoji: '🥗' },
  { value: 'main-course', label: 'Main Course', emoji: '🍽️' },
  { value: 'dessert', label: 'Desserts', emoji: '🍰' },
  { value: 'beverage', label: 'Beverages', emoji: '🥤' },
  { value: 'snack', label: 'Snacks', emoji: '🍿' }
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Browse by Category</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === category.value
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg hover:transform hover:scale-105 border border-gray-200'
            }`}
          >
            <span className="text-lg">{category.emoji}</span>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
