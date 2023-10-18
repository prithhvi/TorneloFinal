import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../component-css/AnalyticPage.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Interface defining the structure of product data
interface ProductData {
  id: number;
  name: string;
  amount: number;
  totalSales: number;
  views: number;
  uptakes: number;
  month: string;
}

/**
 * Analytics component displays detailed statistics of products' performance.
 * It provides a table with product names, detail views, products sold, and total sales.
 * Additionally, it generates bar charts visualizing total sales, detail views, and products sold for each product.
 *
 * @component
 * @example
 * // Example usage of Analytics component:
 * <Analytics />
 */
// Functional component representing the Analytics page
const Analytics: React.FC = () => {
    // State to store product data fetched from the API
  const [data, setData] = useState<ProductData[]>([]);
    // Current date and initial selected month and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const initialMonth = `${currentYear}-${currentMonth}`;
    // State variables to manage selected year and month
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(parseInt(currentMonth, 10));

    // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5100/api/analytics');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ProductData[] = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter data by selected month and year
  const filteredData = data.filter((product) => {
    const [year, month] = product.month.split('-');
    return parseInt(year, 10) === selectedYear && parseInt(month, 10) === selectedMonth;
  });

  // Create a set of product names
  const productNames = new Set(filteredData.map((product) => product.name));

  // Prepare the data for the chart
  const chartData = Array.from(productNames).map((productName) => {
    const productData = filteredData.filter((product) => product.name === productName);
    const monthTotalSales = productData.reduce((total, product) => total + product.totalSales, 0);
    const monthTotalViews = productData.reduce((total, product) => total + (product.views || 0), 0);
    const monthTotalUptakes = productData.reduce((total, product) => total + (product.uptakes || 0), 0);

    return {
      name: productName,
      totalSales: monthTotalSales,
      totalViews: monthTotalViews,
      totalUptakes: monthTotalUptakes,
    };
  });

    // Event handlers for year and month selection
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  return (
    <div className="table-container">
      <div className="month-selector">
        <h1 className="Analytic-title">Analytics </h1>
        <Link to="/shop-admin" className="link">
          <button className="back-button">
            <div className="text-field">
              <p className="text-2">Back</p>
            </div>
          </button>
        </Link>
        <label>Select Year:</label>
        <select value={selectedYear} onChange={handleYearChange}>
          {/* Generate options for years */}
          {Array.from(new Set(data.map((product) => product.month.split('-')[0]))).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <label> Select Month:</label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {/* Generate options for months */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(selectedYear, month - 1, 1).toLocaleDateString('en-US', {
                month: 'long',
              })}
            </option>
          ))}
        </select>
      </div>
      <table className="styled-table">
      <thead>
          <tr>
            <th>Product Name</th>
            <th>Detail Views</th>
            <th>Products Sold</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.views}</td>
              <td>{product.uptakes}</td>
              <td>${product.totalSales}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ textAlign: 'center' }}>Overview Graph</h2>
      <ResponsiveContainer width={800} height={450}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="totalSales" fill="#8884d8" name="Total Sales ($)" />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width={800} height={450}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="totalViews" fill="#ffa500" name="Detail Views (views)" />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width={800} height={450}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="totalUptakes" fill="#008000" name="Product Sold (items)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;


