import React, { useState } from 'react';
import '../component-css/AddProductPage.css';
import { useNavigate } from 'react-router-dom';

/**
 * AddProductPage component allows users to add a new product with specified details.
 * Users can input the product name, cost, description, stock count, and upload images.
 * Form validation is performed for name, cost, and stock count inputs.
 *
 * @component
 * @example
 * // Example usage of AddProductPage component:
 * <AddProductPage />
 */

function AddProductPage() {
    const [prodName, setProdName] = useState('');
    const [prodCost, setProdCost] = useState('');
    const [stockCount, setstockCount] = useState('');
    const [prodDesc, setProdDesc] = useState('');
    const [prodImages, setProdImages] = useState<File[]>([]); // Updated state type
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const navigate = useNavigate();
    const [formError, setFormError] = useState('');

    const handleCancel = () => {
        navigate('/shop-admin');
    };

    // setting values for resolution max and min
    const MAX_WIDTH = 800; 
    const MAX_HEIGHT = 600; 
    const MIN_WIDTH = 400; 
    const MIN_HEIGHT = 300; 
    const validFiles: File[] = [];

    //accept numbers and alphabetical chars
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Use a regular expression to validate the input
        const isValidName = /^[A-Za-z\d\s]+$/.test(inputValue);
        if (isValidName || inputValue.length <= 15) {
           // Update the state only if the input is valid or empty
           setProdName(inputValue);
        }
    };

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

    //handles image file upload, including checking image fits resolution set
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            

            for (const file of files) {
                const img = new Image();
                img.src = URL.createObjectURL(file);

                img.onload = () => {
                    const { width, height } = img;

                    if (width <= MAX_WIDTH && height <= MAX_HEIGHT && width >= MIN_WIDTH && height >= MIN_HEIGHT) {
                        validFiles.push(file);
                    } else {
                        alert(`Image dimensions exceed the allowed resolution of ${MAX_WIDTH}x${MAX_HEIGHT} pixels and is larger then${MIN_WIDTH}x${MIN_HEIGHT} pixels.`);
                    }

                    // Update state only after validation is done
                    if (validFiles.length === files.length) {
                        setProdImages(validFiles);

                        const previews = validFiles.map((file) => URL.createObjectURL(file));
                        setImagePreviews(previews);
                    }
                };
            }
        }
    };

  /**
   * Handles the form submission event. Validates form inputs and submits data to the backend.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Perform any necessary actions, like submitting data to the backend
        // Validation
        const isNameValid = /^[A-Za-z\d\s]+$/.test(prodName);
        const isValidLength = prodName.length <= 15;
        const isNameEmpty = prodName.trim() === '';
        const intValue = parseInt(stockCount, 10); 
        const isStockValid = (intValue >= 0); 
    
        if (!isNameValid || isNameEmpty) {
            setFormError('Please enter a valid name.');
            return;
        }

        if (!isValidLength){
            setFormError('Max of 15 characters for Name');
            return;
        }

        if (!isStockValid) {
            setFormError('Please enter a positive stock count or 0.');
            return;
        }
    
        setFormError('');

        try {
            const formData = new FormData();
            formData.append('prodName', prodName);
            formData.append('prodCost', prodCost);
            formData.append('prodDesc', prodDesc);
            formData.append('stockCount', stockCount);

            prodImages.forEach((file, index) => {
                formData.append('prodImages', file);
            });

            console.log(formData);
    
            const response = await fetch('http://localhost:5100/api/products', {
                method: 'POST',
                body: formData,
            });
    
            const data = await response.json();
    
            // Handle the response as needed
            console.log(data); // Log the response data
    
            // Reset the form input values
            setProdName('');
            setProdCost('');
            setstockCount('');
            setProdDesc('');
            setProdImages([]);
            setImagePreviews([]);
    
            // Navigate to the ShopPage or trigger a refresh to update the product list
            navigate('/shop-admin');
        } catch (error) {
            console.error(error);
            // Handle error
            setFormError('An error occurred while submitting the form.');
          
        }
    };
    
    //validation on price change
    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const price = event.target.value;
        const formattedPrice = /^\d*\.?\d{0,2}$/.test(price) ? price : prodCost;
        setProdCost(formattedPrice);
    };


    const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const price = event.target.value;
        setstockCount(price);
    };

    // html for add product page
    return (
        <div className='add-product-page'>
            <h2 className="AddPageTitle">Add Product</h2>
            {formError && <p className="error-message">{formError}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-column">
                        <label className="label">
                            Name:<span className="mandatory">*</span>
                            <input
                                type="text"
                                className="input"
                                placeholder= "Enter name here"
                                value={prodName}
                                onChange={handleNameChange}
                            />
                        </label>
                        <br />
                        <label className="label">
                            Cost:<span className="mandatory">*</span>
                            <input
                                type="number"
                                className="input"
                                placeholder= "Enter cost here"
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
                                placeholder= "Enter Stock here"
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
                                type= "text"
                                className="DescriptionInput"
                                placeholder= "Enter Description here"
                                value={prodDesc}
                                onChange={handleDescChange}
                            />
                        </label>
                        <br />
                        <label className="ImageLabel">
                            Image:<span className="mandatory">*</span>
                        </label>
                        <br />
                        <div className="file-upload">
                            <label className="file-upload-label">
                                Upload Image
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
                <div className="button-container">
                    <button type="submit" className='save-button'>
                        <span className="save-text">Save</span>
                    </button>
                    <button type="button" className='cancel-button' onClick={handleCancel}>
                        <span className="cancel-text">Cancel</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProductPage;