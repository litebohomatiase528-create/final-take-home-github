
const menuItems = [
  { name: "Dashboard", icon: "⌂" },
  { name: "Suppliers", icon: "🚚" },
  { name: "Vendors", icon: "👥" },
  { name: "Fruits", icon: "🍎" },
  { name: "Stock Management", icon: "📦" },
  { name: "Purchases", icon: "🛒" },
  { name: "Sales", icon: "💰" },
  { name: "Reports", icon: "📊" }
];

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon">🌱</span>
        <div>
          <h2>Batloung Farm</h2>
          <small>Distribution System</small>
        </div>
      </div>

      <p className="menu-heading">MAIN MENU</p>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              activePage === item.name ? "active" : ""
            }`}
            onClick={() => setActivePage(item.name)}
          >
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>🌿</span>
        <div>
          <strong>Batloung Farm</strong>
          <small>Maseru, Lesotho</small>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
