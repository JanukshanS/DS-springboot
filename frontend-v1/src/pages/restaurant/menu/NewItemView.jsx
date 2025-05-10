import React from 'react';
import { useNavigate } from "react-router-dom";
import MenuForm from "./MenuForm";
import { MobileBackButton, NewItemFormContainer } from './UIComponents';

const NewItemView = ({ 
  categories, 
  handleFormSubmit, 
  isSubmitting, 
  formError 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <MobileBackButton to="/restaurant-admin/dashboard" />

      <NewItemFormContainer formError={formError}>
        <MenuForm
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => navigate("/restaurant-admin/menu")}
          isLoading={isSubmitting}
          formError={formError}
        />
      </NewItemFormContainer>
    </div>
  );
};

export default NewItemView;
