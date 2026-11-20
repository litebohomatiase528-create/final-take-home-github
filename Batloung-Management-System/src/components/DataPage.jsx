
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function DataPage({ title, endpoint, fields, columns, idField }) {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const loadRecords = async () => {
    try {
      const data = await apiRequest(endpoint);
      setRecords(Array.isArray(data) ? data : data.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [endpoint]);

  const openForm = (record = null) => {
    setEditingId(record ? record[idField] : null);

    const values = {};
    fields.forEach((field) => {
      values[field.name] = record ? record[field.name] ?? "" : "";
    });

    setForm(values);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiRequest(
        editingId ? `${endpoint}/${editingId}` : endpoint,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(form)
        }
      );

      setShowForm(false);
      await loadRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      await apiRequest(`${endpoint}/${id}`, {
        method: "DELETE"
      });

      await loadRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered = records.filter((record) =>
    columns.some((column) =>
      String(record[column.key] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h2>{title}</h2>
          <p>Manage your {title.toLowerCase()} records.</p>
        </div>

        <button className="primary-btn" onClick={() => openForm()}>
          + Add {title.replace(/s$/, "")}
        </button>
      </div>

      <div className="table-card">
        <input
          className="search-input"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((record) => (
                <tr key={record[idField]}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {record[column.key]}
                    </td>
                  ))}

                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => openForm(record)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(record[idField])}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleSubmit}>
            <h2>{editingId ? "Edit" : "Add"} {title}</h2>

            {fields.map((field) => (
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>

                {field.options ? (
                  <select
                    required={field.required !== false}
                    value={form[field.name]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [field.name]: e.target.value
                      })
                    }
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    required={field.required !== false}
                    value={form[field.name]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [field.name]: e.target.value
                      })
                    }
                  />
                )}
              </div>
            ))}

            <div className="modal-actions">
              <button type="button" className="cancel-btn"
                onClick={() => setShowForm(false)}>
                Cancel
              </button>

              <button type="submit" className="primary-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default DataPage;
