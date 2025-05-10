import React from 'react';
import MenuForm from "./MenuForm";
import MenuUpdateForm from "./MenuUpdateForm";
import { ErrorMessage } from './UIComponents';

const ModalComponent = ({ 
  isOpen, 
  onClose, 
  currentItem, 
  categories, 
  onSubmit, 
  isSubmitting, 
  formError 
}) => {
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-modal="true"
      role="dialog"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className=" inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {currentItem
                  ? `Edit ${currentItem.name}`
                  : "Add New Menu Item"} 
              </h3>
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {currentItem ? (
              <MenuUpdateForm
                initialData={currentItem}
                categories={categories}
                onSubmit={onSubmit}
                onCancel={onClose}
                isLoading={isSubmitting}
                formError={formError}
              />
            ) : (
              <MenuForm
                categories={categories}
                onSubmit={onSubmit}
                onCancel={onClose}
                isLoading={isSubmitting}
                formError={formError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
