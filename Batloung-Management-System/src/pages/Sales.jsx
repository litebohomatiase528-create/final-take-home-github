
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function Sales() {
  const [vendors, setVendors] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [sales, setSales] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState(0);
  const [items, setItems] = useState([
    { fruit_id: "", packaging_size: "Small", quantity: 1, unit_price: 0 }
  ]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [v, f, s] = await Promise.all([
        apiRequest("/vendors"),
        apiRequest("/fruits"),
        apiRequest("/sales")
      ]);

      setVendors(Array.isArray(v) ? v : v.data || []);
      setFruits(Array.isArray(f) ? f : f.data || []);
      setSales(Array.isArray(s) ? s : s.data || []);
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
      { fruit_id: "", packaging_size: "Small", quantity: 1, unit_price: 0 }
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * Number(item.unit_price),
    0
  );

  const outstanding = Math.max(total - Number(amountPaid), 0);

  const saveSale = async (e) => {
    e.preventDefault();

    try {
      if (!vendorId) throw new Error("Please select a vendor.");

      if (items.some((item) =>
        !item.fruit_id ||
        Number(item.quantity) <= 0 ||
        Number(item.unit_price) <= 0
      )) {
        throw new Error("Complete all sale item details.");
      }

      if (Number(amountPaid) < 0 || Number(amountPaid) > total) {
        throw new Error("Amount paid must be between zero and the sale total.");
      }

      await apiRequest("/sales", {
        method: "POST",
        body: JSON.stringify({
          vendor_id: vendorId,
          sale_date: new Date().toISOString().slice(0, 10),
          payment_method: paymentMethod,
          amount_paid: Number(amountPaid),
          items
        })
      });

      setVendorId("");
      setAmountPaid(0);
      setPaymentMethod("Cash");
      setItems([
        { fruit_id: "", packaging_size: "Small", quantity: 1, unit_price: 0 }
      ]);

      setError("");
      await loadData();
      alert("Sale recorded successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h2>Sales Management</h2>
          <p>Record sales and manage vendor payments.</p>
        </div>
      </div>

      <form className="table-card" onSubmit={saveSale}>
        <h3>New Sale</h3>

        <div className="form-group">
          <label>Select Vendor</label>
          <select
            required
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
          >
            <option value="">Choose Vendor</option>
            {vendors.map((v) => (
              <option key={v.vendor_id} value={v.vendor_id}>
                {v.vendor_name}
              </option>
            ))}
          </select>
        </div>

        <h3>Sale Items</h3>

        {items.map((item, index) => (
          <div className="item-row" key={index}>
            <select
              required
              value={item.fruit_id}
              onChange={(e) =>
                updateItem(index, "fruit_id", e.target.value)
              }
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
              placeholder="Selling Price"
              value={item.unit_price}
              onChange={(e) =>
                updateItem(index, "unit_price", e.target.value)
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

        <div className="form-grid">
          <div className="form-group">
            <label>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>Cash</option>
              <option>Mobile Money</option>
              <option>Credit</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount Paid (M)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            />
          </div>
        </div>

        <div className="purchase-total">
          <p>Total Sale: <strong>M {total.toFixed(2)}</strong></p>
          <p>Outstanding Balance:
            <strong> M {outstanding.toFixed(2)}</strong>
          </p>
          <p>Payment Status: 
            <strong>
              {amountPaid >= total && total > 0
                ? " PAID"
                : Number(amountPaid) > 0
                  ? " PARTIALLY PAID"
                  : " UNPAID"}
            </strong>
          </p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="primary-btn">
          Complete Sale
        </button>
      </form>

      <div className="table-card">
        <h3>Sales History</h3>

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
              {sales.map((sale) => (
                <tr key={sale.sale_id}>
                  <td>{sale.sale_id}</td>
                  <td>{sale.vendor_id}</td>
                  <td>{sale.sale_date}</td>
                  <td>{sale.payment_status}</td>
                  <td>M {Number(sale.total_amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Sales;
