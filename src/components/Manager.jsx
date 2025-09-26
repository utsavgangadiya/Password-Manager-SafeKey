import React, { useEffect, useRef, useState } from 'react';
import './Manager.css';

const Manager = () => {
  const passwordRef = useRef(null);
  const showHideRef = useRef(null);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const passwords = localStorage.getItem("passwords");
      if (passwords) {
        setPasswordArray(JSON.parse(passwords));
      }
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
        document.body.classList.add(`${savedTheme}-theme`);
      } else {
        document.body.classList.add('light-theme');
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.remove(`${theme}-theme`);
    document.body.classList.add(`${newTheme}-theme`);
    localStorage.setItem("theme", newTheme);
  };

  const togglePasswordVisibility = () => {
    if (passwordRef.current.type === "password") {
      passwordRef.current.type = "text";
      showHideRef.current.src = "/visible.png";
    } else {
      passwordRef.current.type = "password";
      showHideRef.current.src = "/hide.png";
    }
  };

  const savePassword = () => {
    try {
      let updatedPasswords;
      if (editIndex !== null) {
        updatedPasswords = passwordArray.map((item, index) =>
          index === editIndex ? form : item
        );
      } else {
        updatedPasswords = [...passwordArray, { ...form, id: Date.now() }];
      }
      setPasswordArray(updatedPasswords);
      localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
      setForm({ site: "", username: "", password: "" });
      setEditIndex(null);
    } catch (error) {
      console.error("Failed to save password to localStorage", error);
    }
  };

  const editPassword = (index) => {
    setForm(passwordArray[index]);
    setEditIndex(index);
  };

  const deletePassword = (indexToDelete) => {
    try {
      const newPasswordArray = passwordArray.filter((_, index) => index !== indexToDelete);
      setPasswordArray(newPasswordArray);
      localStorage.setItem("passwords", JSON.stringify(newPasswordArray));
    } catch (error) {
      console.error("Failed to delete password from localStorage", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const renderTable = () => {
    if (passwordArray.length === 0) {
      return (
        <div className="no-passwords-message">
          No Passwords Saved
        </div>
      );
    }
    return (
      <div className="password-table-container">
        <table className="password-table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Username</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {passwordArray.map((item, index) => (
              <tr key={item.id || index}>
                <td className="site-cell">
                  <a href={item.site} target="_blank" rel="noopener noreferrer">{item.site}</a>
                </td>
                <td>{item.username}</td>
                <td>{item.password}</td>
                <td className="actions-cell">
                  <span className="action-icon edit-icon" onClick={() => editPassword(index)}>
                    <lord-icon
                      src="https://cdn.lordicon.com/wuvorxbv.json"
                      trigger="hover"
                      colors="primary:#1a73e8" // A clear blue color
                      style={{ width: "25px", height: "25px" }}>
                    </lord-icon>
                  </span>
                   <span 
          className="action-icon delete-icon text-red-600 hover:text-red-800 cursor-pointer transition-colors mx-1" 
          onClick={() => deletePassword(index)}
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`manager-container ${theme}-theme`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme} className="theme-toggle-button">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <header className="manager-header">
        <h1 className="app-title">
          <span className="app-title-green">&lt;</span>
          SafeKey
          <span className="app-title-green">/&gt;</span>
        </h1>
        <p className="app-subtitle">Your personal Password Manager</p>
      </header>

      <section className="input-section">
        <input
          value={form.site}
          onChange={handleChange}
          placeholder="Enter website URL"
          className="input-field"
          type="text"
          name="site"
        />
        <div className="input-group">
          <input
            value={form.username}
            onChange={handleChange}
            placeholder="Enter Username"
            className="input-field"
            type="text"
            name="username"
          />
          <div className="password-input-wrapper">
            <input
              ref={passwordRef}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="input-field password-field"
              type="password"
              name="password"
            />
            <span
              className="toggle-password-visibility"
              onClick={togglePasswordVisibility}
            >
              <img
                ref={showHideRef}
                className='visibility-icon'
                src={passwordRef.current?.type === "password" ? "/hide.png" : "/visible.png"}
                alt="toggle visibility"
              />
            </span>
          </div>
        </div>
        <button
          onClick={savePassword}
          className="save-button"
        >
          <lord-icon
            src="https://cdn.lordicon.com/gzqofmcx.json"
            trigger="hover"
            colors="primary:#ffffff"
            style={{ width: "20px", height: "20px" }}
          />
          {editIndex !== null ? "Update" : "Save"}
        </button>
      </section>

      <section className="password-list-section">
        <h2 className="section-title">Your Passwords</h2>
        {renderTable()}
      </section>
    </div>
  );
};

export default Manager;