import React, { useState, useEffect } from 'react';
import { useNavigate , Link} from 'react-router-dom';
import '../component-css/PaymentPage.css'; // Import your CSS styles here


interface AnalyticsData {
  id: number;
  name: string;
  amount: number;
  totalSales: number;
  views: number;
  uptakes: number;
  month: string;
}

interface ShoppingCart {
  id: number;
  prodName: string;
  prodQuantity: number;
  prodCost: number;
  prodId: number;
  prodImg: string[];
}

/**
 * PaymentPage component handles the payment process, including displaying shipping information,
 * the order summary, and completing the payment. It also updates analytics data and product stock counts
 * after successful payment.
 *
 * @component
 * @example
 * // Example usage of PaymentPage component:
 * <PaymentPage />
 */
const PaymentPage: React.FC = () => {
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false); // State to control the pop-up
  const navigate = useNavigate(); // Use useNavigate to get the navigation function
  const [Cartdata, setCartData] = useState<ShoppingCart[]>([]);
  const [Analyticdata, setAnalyticData] = useState<AnalyticsData[]>([]);
  const currentDate = new Date().toISOString();
  const currentMonth = new Date().getMonth() + 1;
  // Calculate total cost of items in the shopping cart
  const totalCost = Cartdata.reduce((total, product) => {
    return total + product.prodCost * product.prodQuantity;
  }, 0);
  
  // Fetch analytics data and shopping cart data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5100/api/analytics');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: AnalyticsData[] = await response.json();
        setAnalyticData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5100/api/shoppingCart');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ShoppingCart[] = await response.json();
        setCartData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
 // Function to fetch stock count for a given product ID
  async function fetchStockCount(productId: number): Promise<number> {
    const apiUrl = `http://localhost:5100/api/products/${productId}`;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            return data.stockCount;
        } else {
            throw new Error(`Failed to fetch stockCount for product ID ${productId}. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching stockCount:', error);
        throw error;
    }
}

  // Function to show the pop-up and reroute to the home page
  const handleCompletePayment = async () => {
    setShowPopup(true);

    const asyncOperations = [];

    for (const product of Cartdata) {
        const operation = (async () => {
            try {
                const existingData = Analyticdata.find((item) => {
                    const itemMonth = new Date(item.month).getUTCMonth() + 1;
                    return item.name === product.prodName && itemMonth === currentMonth;
                });

                if (existingData) {
                    // If existing data is found, update it with a PUT request
                    const updatedData = {
                      ...existingData,
                      totalSales: existingData.totalSales + product.prodCost * product.prodQuantity,
                      uptakes: existingData.uptakes + product.prodQuantity,
                    };
                    const stockCount = await fetchStockCount(product.prodId);
                    const updatedStock = {
                        stockCount: stockCount - product.prodQuantity
                    };
                    // updating product stock count
                    try {
                      const updatedStock = {
                          stockCount: stockCount - product.prodQuantity
                      };
          
                      const formData = new FormData();
                      formData.append('prodDetails', JSON.stringify(updatedStock));
          
                      const response = await fetch(`http://localhost:5100/api/products/${product.prodId}`, {
                          method: 'PUT',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(updatedStock),
                      });
          
                      if (response.ok) {
                          console.log('Product updated successfully');
                          navigate('/shop'); // Redirect to the shop page after successful submission
                      } else {
                          console.error('Error updating product');
                          // Handle the error case if needed
                        }
                      } catch (error) {
                      console.error(error);
                      // Handle error
                    }

                    const response = await fetch(`http://localhost:5100/api/analytics/${existingData.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData),
                    });

                    if (response.ok) {
                        console.log(`Successfully updated data for product: ${product.prodName}`);
                    } else {
                        console.error(`Error updating data for product: ${product.prodName}`);
                    }
                } else {
                    // If no existing data is found, create a new entry with a POST request
                    const formData = {
                        name: product.prodName,
                        totalSales: product.prodCost * product.prodQuantity,
                        uptakes: product.prodQuantity,
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
                        console.log(`Successfully posted data for product: ${product.prodName}`);
                    } else {
                        console.error(`Error posting data for product: ${product.prodName}`);
                    }
                }
            } catch (error) {
                console.error('An error occurred while processing product data', error);
            }
        })();

        asyncOperations.push(operation);
    }

    try {
        // Wait for all asynchronous operations to complete
        await Promise.all(asyncOperations);

        // Clear shopping cart after payment
        for (const product of Cartdata) {
            const response = await fetch(`http://localhost:5100/api/shoppingCart/${product.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log(`Successfully deleted data for product: ${product.prodName}`);
            } else {
                console.error(`Error deleting data for product: ${product.prodName}`);
            }
        }

        // Use setTimeout to close the pop-up after a few seconds and reroute
        setTimeout(() => {
            setShowPopup(false);
            navigate('/shop'); // Use navigate('/') for routing to the home page
        }, 3000); // Adjust the delay (in milliseconds) as needed
    } catch (error) {
        console.error('An error occurred:', error);
        // Handle error
    }
};
// Fetch shipping information when the component mounts
  useEffect(() => {
    const fetchShippingInfo = async () => {
      try {
        console.log('Fetching shipping information...');
        const response = await fetch('http://localhost:5100/api/shipping');
        if (response.ok) {
          console.log('Shipping information retrieved successfully.');
          const data = await response.json();

          // Store the last shipping information object
          const lastShippingInfo = data[data.length - 1];

          setShippingInfo(lastShippingInfo); // Update state with the last object
        } else {
          console.error('Error retrieving shipping information');
        }
      } catch (error) {
        console.error('An error occurred while fetching shipping information:', error);
      }
    };

    fetchShippingInfo();
  }, []);

  console.log('Rendering PaymentPage component with shippingInfo:', shippingInfo);

  return (
    <div className='payment-page'>
      <h2 className='PaymentPageTitle'>Payment Page</h2>
      {shippingInfo && Cartdata && (
        <div className='shipping-info-box'>
          <h3>Your Shipping Information</h3>
          <p><b>Name</b>: {shippingInfo.name}</p>
          <p><b>Email</b>: {shippingInfo.email}</p>
          <p><b>Phone</b>: {shippingInfo.phone}</p>
          <p><b>Address</b>: {shippingInfo.address}</p>
          <p><b>State/Region</b>: {shippingInfo.state}</p>
          <p><b>Post Code</b>:  {shippingInfo.postCode}</p>
          <Link to={`/edit-shipping/${shippingInfo.shippingId}`} className="link">
                <button className="editShippingButotn">Edit Shipping Information</button>
          </Link>
          <div className='cart-info'>
              <h3>Your Order</h3>
              {Cartdata.map((product) => (
            <div key={product.prodName} className="payment-product">
              <p> {product.prodQuantity} x  {product.prodName}     ${product.prodCost * product.prodQuantity}</p>
            </div>
        ))}
            <p><b>Total Cost</b>: ${totalCost}</p>
        </div>
        </div>
      )}
      <div className="button-container">
        <button
          className="complete-payment-button"
          onClick={handleCompletePayment}
        >
          Complete Payment
        </button>
      </div>


      {/* Pop-up */}
      {showPopup && (
        <div className='popup'>
          <img src={require('../images/check.png')} alt="Show Sucess" />
          <p>Thank you for your purchase!</p>
        </div>
      )}
      {/* Add your payment form here */}
    </div>
  );
};

export default PaymentPage;
