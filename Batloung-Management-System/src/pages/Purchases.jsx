
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function Purchases() {
  const [suppliers, setSuppliers] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([
    { fruit_id: "", packaging_size: "Small", quantity: 1, unit_cost: 0 }
  ]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [s, f, p] = await Promise.all([
        apiRequest("/suppliers"),
        apiRequest("/fruits"),
        apiRequest("/purchases")
      ]);

      setSuppliers(Array.isArray(s) ? s : s.data || []);
      setFruits(Array.isArray(f) ? f : f.data || []);
      setPurchases(Array.isArray(p) ? p : p.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateItem = (index, field, value) => {
    setItems((previous) =>
      previous.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      { fruit_id: "", packaging_size: "Small", quantity: 1, unit_cost: 0 }
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * Number(item.unit_cost),
    0
  );

  const savePurchase = async (e) => {
    e.preventDefault();

    try {
      if (!supplierId) throw new Error("Select a supplier.");

      if (items.some((item) =>
        !item.fruit_id ||
        Number(item.quantity) <= 0 ||
        Number(item.unit_cost) <= 0
      )) {
        throw new Error("Complete all purchase item details.");
      }

      await apiRequest("/purchases", {
        method: "POST",
        body: JSON.stringify({
          supplier_id: supplierId,
          purchase_date: new Date().toISOString().slice(0, 10),
          items
        })
      });

      setSupplierId("");
      setItems([
        { fruit_id: "", packaging_size: "Small", quantity: 1, unit_cost: 0 }
      ]);

      setError("");
      await loadData();
      alert("Purchase recorded successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h2>Purchases</h2>
          <p>Record fruit purchases from suppliers.</p>
        </div>
      </div>

      <form className="table-card" onSubmit={savePurchase}>
        <h3>New Purchase</h3>

        <div className="form-group">
          <label>Select Supplier</label>
          <select
            required
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">Choose Supplier</option>
            {suppliers.map((s) => (
              <option key={s.supplier_id} value={s.supplier_id}>
                {s.business_name}
              </option>
            ))}
          </select>
        </div>

        <h3>Purchase Items</h3>

        {items.map((item, index) => (
          <div className="item-row" key={index}>
            <select
              required
              value={item.fruit_id}
              onChange={(e) => updateItem(index, "fruit_id", e.target.value)}
            >
              <option value="">Select Fruit</option>
              {fruits.map((fruit) => (
                <option key={fruit.fruit_id} value={fruit.fruit_id}>
                  {fruit.fruit_name}
                </option>
              ))}
            </select>

            <select
              value={item.packaging_size}
              onChange={(e) =>
                updateItem(index, "packaging_size", e.target.value)
              }
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>

            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, "quantity", e.target.value)
              }
            />

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Unit Cost"
              value={item.unit_cost}
              onChange={(e) =>
                updateItem(index, "unit_cost", e.target.value)
              }
            />

            <button type="button" className="delete-btn"
              onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" className="secondary-btn" onClick={addItem}>
          + Add Fruit
        </button>

        <div className="purchase-total">
          Total Purchase: <strong>M {total.toFixed(2)}</strong>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="primary-btn" type="submit">
          Save Purchase
        </button>
      </form>

      <div className="table-card">
        <h3>Purchase History</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Purchase ID</th>
                <th>Supplier ID</th>
                <th>Date</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.purchase_id}>
                  <td>{p.purchase_id}</td>
                  <td>{p.supplier_id}</td>
                  <td>{p.purchase_date}</td>
                  <td>M {Number(p.total_amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Purchases;
