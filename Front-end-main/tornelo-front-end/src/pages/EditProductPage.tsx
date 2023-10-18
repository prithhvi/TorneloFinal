import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../component-css/EditProductPage.css';

/**
 * ConfirmationModal component displays a confirmation dialog with OK and Cancel buttons.
 * It takes a message to display, an onConfirm function to execute on OK button click, 
 * and an onCancel function to execute on Cancel button click.
 *
 * @component
 * @param {object} props - Component props
 * @param {string} props.message - The message to display in the confirmation dialog
 * @param {Function} props.onConfirm - Function to execute on OK button click
 * @param {Function} props.onCancel - Function to execute on Cancel button click
 */

function ConfirmationModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
    return (
      <div className="confirmation-modal-overlay">
        <div className="confirmation-modal">
          <div className="modal-content">
            <p>{message}</p>
            <div className="modal-buttons">
              <button className="OKButton" onClick={onConfirm}>OK</button>
              <button className="CancleButton" onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  
/**
 * EditProductPage component allows editing product details.
 * It provides fields for product name, cost, description, stock count, and images.
 * Users can edit and save product details, delete the product, or cancel the operation.
 *
 * @component
 * @example
 * // Example usage of EditProductPage component:
 * <EditProductPage />
 */

function EditProductPage() {
    const { id } = useParams(); // Get the product ID from the route parameters
    const navigate = useNavigate();

    const [prodName, setProdName] = useState('');
    const [prodCost, setProdCost] = useState('');
    const [prodDesc, setProdDesc] = useState('');
    const [stockCount, setstockCount] = useState('');
    const [prodImages, setProdImages] = useState<File[]>([]); // Updated state for images
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        // Fetch the existing product data from the API based on the ID
        const fetchProductData = async () => {
            try {
                const response = await fetch(`http://localhost:5100/api/products/${id}`);
                if (response.ok) {
                    const product = await response.json();
                    setProdName(product.prodName);
                    setProdCost(product.prodCost.toString());
                    setProdDesc(product.prodDesc);
                    setstockCount(product.stockCount.toString());
                    setImagePreviews(product.prodImages.map((image: string) => image));
                    console.log(product)
                } else {
                    console.error('Error retrieving product data');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchProductData();
    }, [id]);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = () => {
        setShowConfirmation(true);
    };

    const handleConfirmDelete = async() => {
        setShowConfirmation(false);
        // Proceed with the deletion
        try {
            const response = await fetch(`http://localhost:5100/api/products/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Product deleted successfully');
                navigate('/shop-admin'); // Redirect to the shop page after successful deletion
            } else {
                console.error('Error deleting product');
                // Handle the error case if needed
            }
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };

    // Handle cancel button click
    const handleCancel = () => {
        navigate('/shop-admin');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const files = Array.from(e.target.files);
    
          const previews = files.map(file => URL.createObjectURL(file));
          setImagePreviews(previews);
          setProdImages(files);
        }
    };

    //accept numbers and alphabetical chars
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Use a regular expression to validate the input
        const isValidName = /^[A-Za-z\d\s]+$/.test(inputValue);
        if (isValidName || inputValue === '') {
           // Update the state only if the input is valid or empty
           setProdName(inputValue);
        }
    };

    //validation on name change
    //accept numbers and alphabetical chars
    const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Use a regular expression to validate the input
        const isValidName = /^[A-Za-z\d\s]+$/.test(inputValue);
        if (isValidName || inputValue === '') {
           // Update the state only if the input is valid or empty
           setProdDesc(inputValue);
        }
    };

    //validation on price change
    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const price = event.target.value;
        const formattedPrice = /^\d*\.?\d{0,2}$/.test(price) ? price : prodCost;
        setProdCost(formattedPrice);
    };

     // Handle stock count change
    const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const stock = event.target.value;
        setstockCount(stock);
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Perform any necessary actions, like submitting data to the backend
        // Validation for submit 
        const isNameValid = /^[A-Za-z\s]+$/.test(prodName);
        const isNameEmpty = prodName.trim() === '';

        const intValue = parseInt(stockCount, 10); 
        const isStockValid = (intValue >= 0); 
        
        if (!isNameValid || isNameEmpty) {
            setFormError('Please enter a valid name.');
            return;
        }

        if (!isStockValid) {
            setFormError('Please enter a positive stock count or 0.');
            return;
        }
    
        setFormError('');


        try {
            const updatedProduct = {
                id, // Replace `productId` with the actual ID of the product being edited
                prodName,
                prodCost: parseFloat(prodCost),
                prodDesc,
                stockCount:parseFloat(stockCount),
                prodImages
            };

            const formData = new FormData();
            formData.append('prodDetails', JSON.stringify(updatedProduct));

            prodImages.forEach((file, index) => {
                formData.append(`image${index}`, file);
            });

            const response = await fetch(`http://localhost:5100/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            if (response.ok) {
                console.log('Product updated successfully');
                navigate('/shop-admin'); // Redirect to the shop page after successful submission
            } else {
                console.error('Error updating product');
                // Handle the error case if needed
            }
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };


    return (
        <div className="edit-product-page">
            <h2 className="EditPageTitle">Edit Product</h2>
            {formError && <p className="error-message">{formError}</p>}
            {showConfirmation && (
                <ConfirmationModal
                    message="Are you sure you want to delete this product?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-column">
                        <label className="label">
                            Name:<span className="mandatory">*</span>
                            <input
                                type="text"
                                className="input"
                                value={prodName}
                                onChange={handleNameChange}
                            />
                        </label>
                        <label className="label">
                            Cost:<span className="mandatory">*</span>
                            <input
                                type="number"
                                className="input"
                                value={prodCost}
                                onChange={handlePriceChange}
                                step="0.10" // Set the increment value to 0.10
                            />
                        </label>
                        <br />
                        <label className="label">
                            Stock:<span className="mandatory">*</span>
                            <input
                                type="number"
                                className="input"
                                value={stockCount}
                                onChange={handleStockChange}
                                step="1" // Set the increment value to 1
                            />
                        </label>
                    </div>
                    <div className="form-column">
                        <label className="DescriptionLabel">
                            Description:
                            <input
                                type ="text"
                                className="DescriptionInput"
                                value={prodDesc}
                                onChange={handleDescChange}
                            />
                        </label>
                        <br />
                        <label className="ImageLabel">
                            Images:<span className="mandatory">*</span>
                        </label>
                        <br />
                        <div className="file-upload">
                            <label className="file-upload-label">
                                Upload Files
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    multiple
                                    />
                            </label>
                        </div>
                        <br />
                        {imagePreviews.length > 0 && (
                            <div className="image-previews">
                            {imagePreviews.map((preview, index) => (
                                <img
                                    key={index}
                                    src={preview}
                                    alt={`Uploaded ${index + 1}`}
                                    className="uploaded-image"
                                />
                            ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-column">
                        <button type="button" className="delete-button">
                            <span className="delete-text" onClick={handleDelete}>Delete</span>
                        </button>
                    </div>
                </div>
                <div className="button-container">
                    <button type="submit" className="save-button">
                        <span className="save-text">Save</span>
                    </button>
                    <button type="button" className="cancel-button" onClick={handleCancel}>
                        <span className="cancel-text">Cancel</span>
                    </button>
                </div>
            </form>
        </div>
    );

}

export default EditProductPage;
