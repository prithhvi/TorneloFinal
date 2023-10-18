import React, { useEffect, useState } from 'react';
import '../component-css/ShopPage.css';
import ShoppingCart from '../components/ShoppingCart';
import { useParams, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ProductCardOverview from '../components/ProductCard';

interface Product {
    id: number;
    createdAt: string;
    prodName: string;
    prodDesc: string;
    prodCost: number;
    prodImg: string[];
    stockCount : number;
    prodVariant: string;
    prodQuantity: number;
  }

interface ShoppingCart {
    id: number;
    createdAt: string;
    userId: number;
    prodQuantity:number;
    prodCost: number;
    prodId: number;
    prodName: string;
    prodImg: string[];
}

/**
 * `ConfirmationModal` component displays a confirmation modal with provided message,
 * allowing the user to confirm or cancel an action.
 *
 * @component
 * @example
 * // Example usage of ConfirmationModal component:
 * <ConfirmationModal message="Are you sure?" onConfirm={handleConfirm} onCancel={handleCancel} />
 *
 * @param {Object} props - The properties of the component.
 * @param {string} props.message - The message to be displayed in the confirmation modal.
 * @param {Function} props.onConfirm - The function to be executed when user confirms.
 * @param {Function} props.onCancel - The function to be executed when user cancels.
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
 * `ShopPage` component displays the main shop interface, including product listing, cart.
 * Users can add products, view analytics, log out, and view their shopping cart.
 *
 * @component
 * @example
 * // Example usage of ShopPage component:
 * <ShopPage />
 */
function ShopPage() {
    const [isPopupOpen, setPopupOpen] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
      setShowConfirmation(true);
  };

    const handleConfirmLogout = async() => {
      setShowConfirmation(false);
      console.log('LoggedOut');
      navigate('/');
              };

  const handleCancelLogout = () => {
      setShowConfirmation(false);
  };
    useEffect(() => {
      // Add or remove the 'no-scroll' class based on the 'isPopupOpen' state
      if (isPopupOpen) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    }, [isPopupOpen]);
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:5100/api/products');
            if (response.ok) {
              const data = await response.json();
              setProducts(data);
              console.log("Products retrieve sucessfully");
            } else {
              console.error('Error retrieving products');
            }
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchData();
      }, [isPopupOpen]);

    const handleOpenPopup = () => {
        setPopupOpen(true);
    };

    const [shoppingCart, setShoppingCart] = useState<ShoppingCart[]>([]);


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:5100/api/shoppingCart');
            if (response.ok) {
              const data = await response.json();
              setShoppingCart(data);
              console.log(data);
            } else {
              console.error('Error retrieving shopping cart');
            }
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchData();
      }, [isPopupOpen]);

    const handleClosePopup = () => {
        setPopupOpen(false);
    }
    return (
        <div>
            
            <Link to="/add-product" className="link">
                <button className="add-button">
                <img src={require('../images/add-square-02.png')} alt="Add" className="img-1" />
                    <div className="text-field">
                        <p className="text-2">Add Product</p>
                    </div>
                </button>
            </Link>

            <Link to="/analytic" className="link">
                <button className="analytic-button">
                <img src={require('../images/activity.png')} alt="Analytic" className="img-1" />
                    <div className="text-field">
                        <p className="text-2">Analytics</p>
                    </div>
                </button>
            </Link>

            <button className="logout-button">
                <img src={require('../images/logout.png')} alt="Analytic" className="img-1" />
                <span className="text-2" onClick={handleLogout}>Log Out</span>
            </button>

            <button className="cart-button" onClick={handleOpenPopup}>
                <img src={require('../images/cart.png')} alt="Cart" className="img-1" />
                <p className="text-2">Cart</p>
            </button>
            {isPopupOpen && (
                <ShoppingCart
                    onClose={handleClosePopup}
                    headerText={'SHOPPING CART'}
                    product={shoppingCart}
                />
            )}
            <h2 className="ShopPageTitle"> <img src={require('../images/tornelo.png')} alt="Cart" className="img-tornelo" /> Tornelo Shop </h2>
            <ProductCardOverview Products={products}/>
            <div>{showConfirmation && (
                <ConfirmationModal
                    message="Are you sure you want to Log out?"
                    onConfirm={handleConfirmLogout}
                    onCancel={handleCancelLogout}
                />
            )}</div>

        </div>
      

    );
}

export default ShopPage;