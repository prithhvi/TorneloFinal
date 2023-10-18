import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../component-css/ShippingPage.css';

/**
 * ShippingPage component handles user input for shipping information, including name, email, phone number,
 * address, state/region, and postal code. It performs client-side validation and sends the data to the backend
 * upon successful submission. Users can proceed to the payment page or cancel the operation.
 *
 * @component
 * @example
 * // Example usage of ShippingPage component:
 * <ShippingPage />
 */

const ShippingPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [postCode, setPostCode] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  // Add more state variables for other shipping details if needed

  const handleCancel = () => {
    navigate('/shop');
  };

  //only accept alphabetical chars
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Use a regular expression to validate the input
    const isValidName = /^[A-Za-z\s]+$/.test(inputValue);
    if (isValidName || inputValue === '') {
      // Update the state only if the input is valid or empty
      setName(inputValue);
    }
  };

  //only accept alphabetical chars
  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Use a regular expression to validate the input
    const isValidName = /^[A-Za-z\s]+$/.test(inputValue);
    if (isValidName || inputValue === '') {
      // Update the state only if the input is valid or empty
      setState(inputValue);
    }
  };
  
  //only accept numbers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Use a regular expression to validate the input (e.g., allow only digits)
    const isValidPhone = /^\d*$/.test(inputValue);
    if (isValidPhone && inputValue.length <= 10) {
      // Update the state only if the input is valid or empty
      setPhone(inputValue);
    }
  };

  const handlePostCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Use a regular expression to validate the input (e.g., allow only digits)
    const isValidPostCode = /^\d*$/.test(inputValue);
    // Enforce a maximum length of 4 digits
    if (isValidPostCode && inputValue.length <= 4) {
      // Update the state only if the input is valid and within the length limit
      setPostCode(inputValue);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform any necessary actions, like submitting data to the backend
    // Validation
    const isNameValid = /^[A-Za-z\s]+$/.test(name);
    const isNameEmpty = name.trim() === '';
    const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
    const isPhoneValid = /^\d{10}$/.test(phone);
    const isAddressEmpty = address.trim() === '';
    const isStateEmpty = state.trim() === '';
    const isPostCodeEmpty = postCode.trim() === '';

    if (!isNameValid || isNameEmpty) {
        setFormError('Please enter a valid name.');
        return;
    }

    if (!isEmailValid) {
        setFormError('Please enter a valid email address.');
        return;
    }

    if (!isPhoneValid) {
        setFormError('Please enter a valid 10-digit phone number.');
        return;
    }

    if (isAddressEmpty || isStateEmpty || isPostCodeEmpty) {
        setFormError('Please fill out all address-related fields.');
        return;
    }

    // If all validations pass, clear any previous errors
    setFormError('');


    try {
        const shippingInformation = {
            name,
            address,
            email,
            phone,
            postCode,
            state
        }

        const response = await fetch('http://localhost:5100/api/shipping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shippingInformation),
        });

        const data = await response.json();

        // Handle the response as needed
        console.log(data); // Log the response data


        // Reset the form input values
        setName('');
        setAddress('');
        setEmail('');
        setPostCode('');
        setPhone('');
        setState('');

        
        navigate('/payment');
    } catch (error) {
        console.error(error);
        // Handle error, e.g., display an error message to the user
      setFormError('An error occurred while submitting the form.');
    }
  };
  
  return (
    <div className='shipping-page'>
            <h2 className="shipping-page-title">Shipping Information</h2>
            {formError && <p className="error-message">{formError}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-column">
                        <label className="label">
                            Name<span className="mandatory">*</span>
                            <input
                                type="text"
                                className="input"
                                placeholder= "Enter name here"
                                value={name}
                                onChange={handleNameChange}
                            />
                        </label>
                        <br />
                        <label className="label">
                            Email<span className="mandatory">*</span>
                            <input
                                type="text"
                                className="input"
                                placeholder= "Enter email here"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <br />
                        <label className="label">
                            Phone<span className="mandatory">*</span>
                            <input
                                className="input"
                                placeholder= "Enter 10-digit phone number here"
                                value={phone}
                                onChange={handlePhoneChange}
                            />
                        </label>
                        
                    </div>
                    <div className="form-column">
                        
                        <label className="label">
                            Address<span className="mandatory">*</span>
                            <input
                                className="input"
                                placeholder= "Enter address here"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </label>
                        <br />
                        <label className="label">
                          State/Region<span className="mandatory">*</span>
                          <input
                            type="text"
                            className="input"
                            placeholder="Enter state/region here"
                            value={state}
                            onChange={handleStateChange}
                          />
                        </label>
                        <label className="label">
                          Postal Code<span className="mandatory">*</span>
                          <input
                            type="text"
                            className="input"
                            placeholder="Enter postal code here"
                            value={postCode}
                            onChange={handlePostCodeChange}
                          />
                        </label>
                    </div>
                </div>
                <div className="form-row">
                  <div className='form-column'>
                    <span className='required'>* indicates required fields</span>
                  </div>
                  <div className='form-column'>
                    <div className="button-container">
                        <button type="submit" className='proceed-button'>
                            <span className="proceed-text">Proceed to Payment</span>
                        </button>
                        <button type="button" className='cancel-button' onClick={handleCancel}>
                            <span className="cancel-text">Cancel</span>
                        </button>
                    </div>
                  </div>
                </div>
                
            </form>

            
        </div>
  );
};

export default ShippingPage;