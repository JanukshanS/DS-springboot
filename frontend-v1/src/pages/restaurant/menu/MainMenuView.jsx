import React from 'react';
import { LoadingSpinner, NoItemsFound, ErrorMessage, MobileBackButton } from './UIComponents';
import MenuHeader from './MenuHeader';
import SearchAndFilter from './SearchAndFilter';
import CategoryTabs from './CategoryTabs';
import MenuItemsList from './MenuItemsList';
import ModalComponent from './ModalComponent';

const MainMenuView = ({
  loading,
  error,
  menuItems,
  filteredItems,
  categories,
  activeCategory,
  searchTerm,
  isModalOpen,
  currentItem,
  isSubmitting,
  formError,
  handleAddItem,
  handleEditItem,
  handleDeleteItem,
  handleModalClose,
  handleFormSubmit,
  handleSearchChange,
  clearFilters,
  setActiveCategory,
  handleBulkAvailabilityUpdate
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <MobileBackButton to="/restaurant-admin/dashboard" />

      <MenuHeader 
        onAddItem={handleAddItem}
        onMarkAvailable={() => handleBulkAvailabilityUpdate(true)}
        onMarkUnavailable={() => handleBulkAvailabilityUpdate(false)}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <SearchAndFilter 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          hasFilters={searchTerm || activeCategory !== 'all'}
          onClearFilters={clearFilters}
        />
        
        <CategoryTabs 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="px-6 py-4">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : menuItems.length === 0 ? (
            <NoItemsFound
              activeCategory={activeCategory}
              onAddClick={handleAddItem}
            />
          ) : (
            <MenuItemsList 
              items={filteredItems}
              categories={categories}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          )}
        </div>
      </div>

      {/* Edit Menu Item Modal */}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={handleModalClose}
        currentItem={currentItem}
        categories={categories}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        formError={formError}
      />
    </div>
  );
};

export default MainMenuView;
