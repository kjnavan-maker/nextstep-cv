import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        NextStep <span>CV</span>
      </div>

      <div className={`nav-links ${open ? "show-menu" : ""}`}>
        <a href="#home" onClick={() => setOpen(false)}>
          Home
        </a>

        <a href="#services" onClick={() => setOpen(false)}>
          Services
        </a>

        <a href="#packages" onClick={() => setOpen(false)}>
          Packages
        </a>

        <a href="#portfolio" onClick={() => setOpen(false)}>
          Portfolio
        </a>

        <a href="#contact" onClick={() => setOpen(false)}>
          Contact
        </a>
      </div>

      <a
        className="nav-btn"
        href="https://wa.me/94770000000"
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>

      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>
    </nav>
  );
}

export default Navbar;