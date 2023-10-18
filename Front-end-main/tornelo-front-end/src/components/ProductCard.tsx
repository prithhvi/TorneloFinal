import React from 'react';
import "../component-css/ProductCard.css";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

/**
 * ProductCard component displays a single product with its details.
 * Users can view product information, add it to the cart, and view more details.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {number} props.id - The unique identifier for the product.
 * @param {string} props.prodName - The name of the product.
 * @param {number} props.prodQuantity - The quantity available for the product.
 * @param {number} props.prodCost - The cost of the product.
 * @param {string} props.prodDesc - The description of the product.
 * @param {string[]} props.prodImg - Array of URLs representing product images.
 * @param {number} props.stockCount - The current stock count of the product.
 * @example
 * // Example usage of ProductCard component:
 * <ProductCard
 *   id={1}
 *   prodName="Sample Product"
 *   prodQuantity={10}
 *   prodCost={29.99}
 *   prodDesc="Sample product description."
 *   prodImg={['linkproduct1', 'linkproduct2']}
 *   stockCount={10}
 * />
 */

/* interfaces for product card */
interface Product {
    id: number;
    prodName: string;
    prodQuantity: number;
    prodCost: number;
    prodDesc: string;
    prodImg: string[];
    stockCount: number;
}

interface ProductProps {
  Products: Product[];
}

interface AnalyticsData {
    id: number;
    name: string;
    amount: number;
    totalSales: number;
    views: number;
    uptakes: number;
    month: string;
  }

/* Product card component */
const ProductCard: React.FC<Product> = ({ id, prodName, prodQuantity, prodCost, prodDesc, prodImg, stockCount }: Product) => {

    const [isOpen, setIsOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the currently displayed image
    const [data, setData] = useState<AnalyticsData[]>([]);
    const currentDate = new Date().toISOString();
    const currentMonth = new Date().getMonth() + 1;
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    let userRole = sessionStorage.getItem('USER_ROLE')

   const toggleSuccessMessage = () => {
      setShowSuccessMessage(true);
      setTimeout(() => {
      setShowSuccessMessage(false);
    }, 1000);
  };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:5100/api/analytics');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const result: AnalyticsData[] = await response.json();
            setData(result);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

    const handleAddToCart = async () => {
        const product = {
            prodId : id,
            prodName,
            userId: 1,
            prodQuantity: 1,
            prodCost,
            prodDesc,
            prodImg
        };

        try {
            const response = await fetch('http://localhost:5100/api/shoppingCart');
            if (response.ok) {
                const data = await response.json();
                const existingProduct = data.find((item: Product) => item.prodName === prodName);
                if (existingProduct) {
                    const updatedProduct = {
                        ...existingProduct,
                        prodQuantity: existingProduct.prodQuantity + 1,
                    };
                    await fetch(`http://localhost:5100/api/shoppingCart/${existingProduct.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedProduct),
                    });
                    toggleSuccessMessage();
                    console.log('Product quantity updated in the shopping cart');
                } else {
                    await fetch('http://localhost:5100/api/shoppingCart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(product),
                    });
                    console.log('Product added to the shopping cart');
                  toggleSuccessMessage();
                }
            } else {
                console.error('Error retrieving shopping cart');
            }
        } catch (error) {
            console.error(error);
        }
    };

    /* handles swapping image when button clicked  */
    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % prodImg.length);
    };

    const showPreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + prodImg.length) % prodImg.length);
    };

    const handleExpandCard = async (productName: string) => {
        setIsOpen(!isOpen); // Toggle the isOpen state
      
        if (!isOpen) {
          console.log("expand")
          // Check if there is existing data with the same product name and month
          const existingData = data.find((item) => {
            const itemMonth = new Date(item.month).getUTCMonth() + 1; // Extract month as a number
            console.log(currentMonth)
            return item.name === productName && itemMonth === currentMonth;
          });
          if (existingData) {
            console.log('find matching data')
            try {
              // If existing data is found, update it with a PUT request
              const updatedData = {
                ...existingData,
                views: existingData.views + 1, // Increment the views
              };
      
              const response = await fetch(`http://localhost:5100/api/analytics/${existingData.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
              });
      
              if (response.ok) {
                console.log(`Successfully updated data for product: ${productName}`);
              } else {
                console.error(`Error updating data for product: ${productName}`);
              }
            } catch (error) {
              console.error('An error occurred while updating product data', error);
            }
          } else {
            // If no existing data is found, create a new entry with a POST request
            try {
              const formData = {
                name: productName,
                views: 1,
                month: currentDate,
              };
      
              const response = await fetch('http://localhost:5100/api/analytics/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
              });
      
              if (response.ok) {
                console.log(`Successfully posted data for product: ${productName}`);
              } else {
                console.error(`Error posting data for product: ${productName}`);
              }
            } catch (error) {
              console.error('An error occurred while posting product data', error);
            }
          }
        }
      };
      

    let divClass = '';
    let buttonHide = (userRole == "ROLE_ADMIN")
    let buttonVis = '';
    if (isOpen) divClass = '-expanded';
    if (isOpen) buttonVis = 'none';

    /* html for product card */
    return (
        <div className={"productCard" + divClass}>
            <img className={"product-image" + divClass} src={prodImg[currentImageIndex]} alt={prodName} />
            <Link to={`/edit-product/${id}`} className="link">
                        {buttonHide && <button className="editProductButton">Edit Product</button>}
            </Link>
            <button className={'swap-img-left'} onClick={showPreviousImage}>
                <img src={require('../images/right-arrow.png')} alt="Show Left" className="leftArrow" />
            </button>
            <button className={'swap-img-right'} onClick={showNextImage}>
                <img src={require('../images/right-arrow.png')} alt="Show Right" className="rightArrow" />
            </button>
            <h1 className={"product-title" + divClass}>{prodName}</h1>
            <p className={"product-price" + divClass}>$ {prodCost}</p>
            {stockCount > 0 ? (
            <button className={"addToCartButton" + divClass} onClick={handleAddToCart}>Add To Cart</button>
            ) : (
             <p  className = {"product-price"} > <b> Out of Stock </b> </p>
            )}
            {showSuccessMessage && (
                <div className="success-popup">
                  <img src={require('../images/check.png')} alt="Show Sucess" />
                    <p className="success-message">Product added to the cart successfully!</p>
                </div>
            )}

            <button className={"expandProduct" + divClass} onClick={() => handleExpandCard(prodName)}>
                <img src={require('../images/showMore.png')} alt="Show More" className= {"showMoreImage" + divClass} />
            </button>
            {isOpen && (
                <div>
                    
                    <div className="product-desc-container"> 
                    <p className="product-desc"> Current Stock: {stockCount}</p>
                    <p className="product-desc"> {prodDesc}</p>
                    </div>
                </div>
            )}
        </div>
    )
};

/**
 * ProductCardOverview component displays a collection of products using ProductCard component.
 * It maps through an array of products and renders individual ProductCard components.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Product[]} props.Products - Array of products to be displayed.
 * @example
 * // Example usage of ProductCardOverview component:
 * <ProductCardOverview Products={products} />
 */

/* Product card overview */
/* New Product card component created for each product */
const ProductCardOverview: React.FC<ProductProps> = ({ Products }: ProductProps) => {
    return (
        <div className={"product-overview"}>
            {Products.map(product => (
                    <ProductCard id={product.id} prodName={product.prodName}
                        prodQuantity={product.prodQuantity}
                        prodImg = {product.prodImg}
                        stockCount = {product.stockCount}
                        prodCost={product.prodCost}
                        prodDesc={product.prodDesc} />
            ))}
        </div>

    )
}

export default ProductCardOverview;

