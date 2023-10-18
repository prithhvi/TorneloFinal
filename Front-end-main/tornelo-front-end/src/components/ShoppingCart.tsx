import React, { useEffect, useState } from 'react';
import {Link } from 'react-router-dom';

import '../component-css/ShoppingCart.css';

/**
 * ShoppingCart component displays a popup modal showing the products in the user's shopping cart.
 * Users can view, update quantities, remove items, and proceed to checkout from this modal.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {function} props.onClose - Function to close the popup modal.
 * @param {string} props.headerText - Text displayed in the header of the popup modal.
 * @param {Array} props.product - Array of products in the cart with details.
 * @example
 * // Example usage of ShoppingCart component:
 * <ShoppingCart onClose={handleClose} headerText="Shopping Cart" product={products} />
 */

// Interface for props passed to the ShoppingCart component
interface PopupModalProps {
  onClose: () => void;
  headerText: string;
  product: {
    id: number;
    prodName: string;
    prodQuantity: number;
    prodCost: number;
    prodId: number;
    prodImg: string[]; // Array of products in the cart
  }[]
}

// Interface defining the structure of a product
interface Product {
  id: number;
  prodName: string;
  prodQuantity: number;
  prodCost: number;
  prodId: number;
  prodImg: string[];
}

const ShoppingCart: React.FC<PopupModalProps> = ({ onClose, headerText, product}) => {
  // Current date and time in ISO format
  const currentDate = new Date().toISOString();
   // State for storing the list of products in the cart
  const [products, setProdcuts] = useState<Product[]>(product);

    // Function to calculate the total cost of products in the cart
  const calculateTotalCost = (products: Product[]) => {
    return products.reduce((total, products: Product) => {
      return total + products.prodCost * products.prodQuantity;
    }, 0);
  }

  // State to store the total cost of products in the cart
  const [totalCost, setTotalCost] = useState<number>(calculateTotalCost(products));

   // Function to handle removal of a product from the cart
  const handleRemove = async (Id: number) => {
      // Asynchronous function to handle removal of a product by sending a DELETE request to the server
    try {
      const response = await fetch(`http://localhost:5100/api/shoppingCart/${Id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Product removed successfully
        console.log('Product removed successfully');
      } else {
        // Handle error response
        console.error('Error removing product');
      }
    } catch (error) {
      // Handle network or request error
      console.error('An error occurred while removing the product', error);
    }
  };

    // Function to handle decreasing quantity of a product in the cart
    const handleMinus = async (Id: number, quantity: number) => {
      // Ensure the quantity doesn't go below zero
      const newQuantity = Math.max(quantity - 1, 1);
    
      // Asynchronous function to handle decreasing quantity of a product by sending a PUT request to the server
      try {
        const formData = {
          prodQuantity: newQuantity
        };
    
        const response = await fetch(`http://localhost:5100/api/shoppingCart/${Id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
    
        if (response.ok) {
          // Decreased Product quantity successfully
          console.log('Decreased Product quantity successfully');
        } else {
          // Handle error response
          console.error('Error Decreased Product quantity');
        }
      } catch (error) {
        // Handle network or request error
        console.error('An error occurred while Decreased Product quantity', error);
      }
    };
    

    // Function to handle increasing quantity of a product in the cart
  const handlePlus = async (Id: number, quantity:number) => {
    try {
      const formData = {
        prodQuantity: quantity + 1
      };
      console.log(JSON.stringify(formData))
      const response = await fetch(`http://localhost:5100/api/shoppingCart/${Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Product quantity increased successfully
        console.log('Product quantity increased successfully');
      } else {
        // Handle error response
        console.error('Error increase product quantity');
      }
    } catch (error) {
      // Handle network or request error
      console.error('An error occurred while increase the product quantity', error);
    }
  };

  // Effect hook to fetch updated product data whenever the products state changes
  useEffect(() => {
    // Fetch the updated product data whenever the `products` state changes
    const fetchProductData = async () => {
      try {
        const response = await fetch('http://localhost:5100/api/shoppingCart');
        if (response.ok) {
          const data = await response.json();
          setProdcuts(data);
          // Recalculate the total cost based on the updated products
          const updatedTotalCost = calculateTotalCost(products);
          setTotalCost(updatedTotalCost);
        } else {
          console.error('Failed to fetch product data');
        }
      } catch (error) {
        console.error('An error occurred while fetching product data', error);
      }
    };

    fetchProductData();
  }, [products]);

  return (
    <div className="popup">
      <div className="popup-inner">
        <div className="popup-header">
        <div className="product-container">
        <div className="mobile-summary">
          <h3>Summary</h3>
        <div className="summary-content">
          {products.map((product) => (
            <div key={product.prodName} className="summary-product">
              <span className="prodQuantity">{product.prodQuantity} x </span>
              <span className="prodName">{product.prodName}</span>
              <span className="prodCost"> ${product.prodCost * product.prodQuantity}</span>
            </div>
        ))}
        </div>
        <div className="summary-total">
              <span className="summary-total-label">Total Cost:</span>
              <span className="summary-total-prodCost">${totalCost}</span>
        </div>
        <div className="summary-button">
        <button className = "button-summary">Proceed To Checkout</button>
        </div>
      </div>
        {products.map((product) => (
        <div key={product.prodName} className="product">
          <img src={product.prodImg[0]} alt={product.prodName} className='ShoppingCart-prodImage'/>
          <div className="product-info">
            <h3 className="cart-product-title">{product.prodName} </h3>
            <p className="cart-product-cost"> ${product.prodCost}</p>
            <div className="quantity-control">
                <button className='minus-button' onClick={() => handleMinus(product.id, product.prodQuantity)}>-</button>
                <span className="quantity">{product.prodQuantity}</span>
                <button className='plus-button' onClick={() => handlePlus(product.id, product.prodQuantity)}>+</button>
              </div>
            <button className="remove" onClick={() => handleRemove(product.id)}>Remove </button>
          </div>
        </div>
      ))}
     </div>
        <div className="popup-summary">
          <h3>Summary</h3>
        <div className="summary-content">
          {products.map((product) => (
            <div key={product.prodName} className="summary-product">
              <span className="prodQuantity">{product.prodQuantity} x </span>
              <span className="prodName">{product.prodName}</span>
              <span className="prodCost"> ${product.prodCost * product.prodQuantity}</span>
            </div>
        ))}
        </div>
        <div className="summary-total">
              <span className="summary-total-label">Total Cost:</span>
              <span className="summary-total-prodCost">${totalCost}</span>
        </div>
        <Link to="/shipping" className="link">
          <div className="summary-button">
          <button className = "button-summary" >Proceed To Checkout</button>
          </div>
        </Link>
      </div>
          <img src={require('../images/cart.png')} alt={headerText} className='Shopping-image'/>
          <h2>{headerText}</h2>
          <button className="buttonClose" onClick={onClose}>
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;