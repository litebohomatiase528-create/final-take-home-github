
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import "./Reports.css";

function Reports() {
  const [topFruits, setTopFruits] = useState([]);
  const [topVendor, setTopVendor] = useState(null);
  const [stock, setStock] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  // Get an array from the API response
  const getArray = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
  };

  // Load fruit, vendor and stock reports
  const loadReports = async () => {
    try {
      const [fruits, vendor, stockData] = await Promise.all([
        apiRequest("/reports/top-fruits"),
        apiRequest("/reports/top-vendor"),
        apiRequest("/stock")
      ]);

      setTopFruits(getArray(fruits));

      const vendorData = vendor?.data ?? vendor;
      setTopVendor(
        Array.isArray(vendorData) ? vendorData[0] || null : vendorData
      );

      setStock(getArray(stockData));
      setError("");
    } catch (err) {
      setError(err.message || "Could not load reports.");
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Generate revenue report for selected dates
  const loadRevenue = async () => {
    try {
      if (!startDate || !endDate) {
        throw new Error("Please select both dates.");
      }

      if (startDate > endDate) {
        throw new Error("Start date cannot be after end date.");
      }

      const response = await apiRequest(
        `/reports/revenue?start_date=${startDate}&end_date=${endDate}`
      );

      const rows = getArray(response);

      const chartData = rows.map((item) => ({
        date: String(item.sale_date).slice(0, 10),
        total_revenue: Number(item.total_revenue || 0)
      }));

      const total = chartData.reduce(
        (sum, item) => sum + item.total_revenue,
        0
      );

      setRevenueData(chartData);
      setRevenue(total);
      setError("");
    } catch (err) {
      setError(err.message || "Could not generate revenue report.");
      setRevenueData([]);
      setRevenue(0);
    }
  };

  // Prepare stock information for the graph
  const stockChartData = stock.map((item) => ({
    name: `${item.fruit_name} (${item.packaging_size})`,
    quantity: Number(item.available_quantity || 0)
  }));

  return (
    <section className="page reports-page">
      <div className="page-heading">
        <div>
          <h2>Business Reports</h2>
          <p>View sales performance and stock reports.</p>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* SALES REVENUE */}
      <div className="table-card">
        <h3>Sales Revenue Report</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button className="primary-btn" onClick={loadRevenue}>
          Generate Revenue Report
        </button>

        <div className="report-total">
          <span>Total Sales Revenue</span>
          <h2>M {revenue.toFixed(2)}</h2>
        </div>

        <div className="report-chart">
          <h3>Sales Revenue Graph</h3>

          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `M ${Number(value).toFixed(2)}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_revenue"
                  name="Revenue"
                  stroke="#7467f0"
                  strokeWidth={3}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty">
              Select dates and generate a revenue report to view the graph.
            </p>
          )}
        </div>
      </div>

      {/* TOP FIVE FRUITS */}
      <div className="table-card">
        <h3>Top Five Most Frequently Sold Fruits</h3>

        <div className="report-chart">
          {topFruits.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topFruits.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fruit_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="total_quantity"
                  name="Quantity Sold"
                  fill="#7467f0"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty">No fruit sales records found.</p>
          )}
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Fruit</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>

            <tbody>
              {topFruits.slice(0, 5).map((fruit, index) => (
                <tr key={fruit.fruit_id || index}>
                  <td>{fruit.fruit_name}</td>
                  <td>
                    {fruit.total_quantity ?? fruit.quantity_sold ?? 0}
                  </td>
                </tr>
              ))}

              {topFruits.length === 0 && (
                <tr>
                  <td colSpan="2">No sales records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP VENDOR */}
      <div className="table-card">
        <h3>Top Selling Vendor</h3>

        {topVendor ? (
          <p>
            <strong>{topVendor.vendor_name || "Vendor"}</strong>
            {" - "}
            {topVendor.total_boxes ?? topVendor.total_quantity ?? 0} boxes
          </p>
        ) : (
          <p>No vendor report available.</p>
        )}
      </div>

      {/* CURRENT STOCK */}
      <div className="table-card">
        <h3>Current Stock Report</h3>

        <div className="report-chart">
          {stockChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={90}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="quantity"
                  name="Available Boxes"
                  fill="#20a779"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty">No stock records found.</p>
          )}
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Fruit</th>
                <th>Packaging Size</th>
                <th>Available Boxes</th>
              </tr>
            </thead>

            <tbody>
              {stock.map((item, index) => (
                <tr key={item.stock_id || index}>
                  <td>{item.fruit_name}</td>
                  <td>{item.packaging_size}</td>
                  <td>{item.available_quantity}</td>
                </tr>
              ))}

              {stock.length === 0 && (
                <tr>
                  <td colSpan="3">No stock records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Reports;
