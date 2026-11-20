
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function StockManagement() {
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadStock = async () => {
    try {
      const data = await apiRequest("/stock");
      setStock(Array.isArray(data) ? data : data.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  const fruits = [...new Set(stock.map((item) => item.fruit_name))]
    .filter((name) => name?.toLowerCase().includes(search.toLowerCase()));

  const getQuantity = (fruit, size) => {
    const record = stock.find(
      (item) =>
        item.fruit_name === fruit &&
        item.packaging_size === size
    );

    return record ? Number(record.available_quantity) : 0;
  };

  const total = stock.reduce(
    (sum, item) => sum + Number(item.available_quantity || 0),
    0
  );

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h2>Stock Management</h2>
          <p>Monitor fruit stock by packaging size.</p>
        </div>

        <button className="secondary-btn" onClick={loadStock}>
          ↻ Refresh Stock
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Stock Boxes</span>
          <h2>{total.toLocaleString()}</h2>
        </div>

        <div className="stat-card">
          <span>Fruit Types</span>
          <h2>{fruits.length}</h2>
        </div>
      </div>

      <div className="table-card">
        <input
          className="search-input"
          placeholder="Search fruit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Fruit</th>
                <th>Small Boxes</th>
                <th>Medium Boxes</th>
                <th>Large Boxes</th>
                <th>Total Boxes</th>
              </tr>
            </thead>

            <tbody>
              {fruits.map((fruit) => {
                const small = getQuantity(fruit, "Small");
                const medium = getQuantity(fruit, "Medium");
                const large = getQuantity(fruit, "Large");

                return (
                  <tr key={fruit}>
                    <td><strong>{fruit}</strong></td>
                    <td>{small}</td>
                    <td>{medium}</td>
                    <td>{large}</td>
                    <td>
                      <strong>{small + medium + large}</strong>
                    </td>
                  </tr>
                );
              })}

              {fruits.length === 0 && (
                <tr>
                  <td colSpan="5">No stock records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default StockManagement;
