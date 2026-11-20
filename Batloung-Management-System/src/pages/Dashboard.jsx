
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    fruits: 0,
    suppliers: 0,
    vendors: 0,
    stock: 0,
    sales: 0,
    revenue: 0
  });

  const [recentSales, setRecentSales] = useState([]);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      const [fruits, suppliers, vendors, stock, sales] =
        await Promise.all([
          apiRequest("/fruits"),
          apiRequest("/suppliers"),
          apiRequest("/vendors"),
          apiRequest("/stock"),
          apiRequest("/sales")
        ]);

      const fruitData = Array.isArray(fruits) ? fruits : fruits.data || [];
      const supplierData = Array.isArray(suppliers) ? suppliers : suppliers.data || [];
      const vendorData = Array.isArray(vendors) ? vendors : vendors.data || [];
      const stockData = Array.isArray(stock) ? stock : stock.data || [];
      const salesData = Array.isArray(sales) ? sales : sales.data || [];

      setStats({
        fruits: fruitData.length,
        suppliers: supplierData.length,
        vendors: vendorData.length,
        stock: stockData.reduce(
          (sum, item) => sum + Number(item.available_quantity || 0),
          0
        ),
        sales: salesData.length,
        revenue: salesData.reduce(
          (sum, item) => sum + Number(item.total_amount || 0),
          0
        )
      });

      setRecentSales(
        [...salesData].sort(
          (a, b) => new Date(b.sale_date) - new Date(a.sale_date)
        ).slice(0, 5)
      );

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    { title: "Total Fruits", value: stats.fruits, icon: "🍎" },
    { title: "Total Suppliers", value: stats.suppliers, icon: "🚚" },
    { title: "Registered Vendors", value: stats.vendors, icon: "👥" },
    { title: "Available Stock", value: stats.stock, icon: "📦" },
    { title: "Total Sales", value: stats.sales, icon: "🧾" },
    { title: "Sales Revenue", value: `M ${stats.revenue.toFixed(2)}`, icon: "💰" }
  ];

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h2>Business Overview</h2>
          <p>Here is an overview of your farm distribution operations.</p>
        </div>

        <button className="secondary-btn" onClick={loadDashboard}>
          ↻ Refresh
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="stats-grid">
        {cards.map((card) => (
          <div className="stat-card" key={card.title}>
            <div className="stat-top">
              <span>{card.title}</span>
              <span className="stat-icon">{card.icon}</span>
            </div>
            <h2>{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="page-heading">
          <div>
            <h3>Recent Sales</h3>
            <p>Latest recorded sales transactions.</p>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Vendor ID</th>
                <th>Date</th>
                <th>Payment Status</th>
                <th>Total Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.sale_id}>
                  <td>{sale.sale_id}</td>
                  <td>{sale.vendor_id}</td>
                  <td>{sale.sale_date}</td>
                  <td>
                    <span className="status-badge">
                      {sale.payment_status}
                    </span>
                  </td>
                  <td>M {Number(sale.total_amount).toFixed(2)}</td>
                </tr>
              ))}

              {recentSales.length === 0 && (
                <tr>
                  <td colSpan="5">No sales recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
