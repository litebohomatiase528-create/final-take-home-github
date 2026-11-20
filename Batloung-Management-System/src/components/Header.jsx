
function Header({ activePage }) {
  return (
    <header className="header">
      <div>
        <h2>{activePage}</h2>
        <p>Welcome to Batloung Farm Distribution System</p>
      </div>

      <div className="header-right">
        <span className="header-location">📍 Maseru, Lesotho</span>
        <div className="admin-avatar">A</div>
        <div>
          <strong>Administrator</strong>
          <small>System Admin</small>
        </div>
      </div>
    </header>
  );
}

export default Header;
