// =============================================================
// FILE: frontend/src/App.js
// INSTRUCTIONS: This is the main file for your React app.
// Replace the existing content of App.js with this code.
// =============================================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This line is crucial. It tells our app to use the API URL
// from an environment variable, but falls back to our local
// server URL if the variable isn't set.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function App() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch customers when the component loads
  useEffect(() => {
    axios.get(`${API_URL}/api/customers`)
      .then(response => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching customers:", err);
        setError('Failed to fetch customers. Ensure the backend is running and accessible.');
        setLoading(false);
      });
  }, []);

  // Handle form submission to add a new customer
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    axios.post(`${API_URL}/api/customers`, { name, phone, email })
      .then(response => {
        // Add the new customer to the top of the list
        setCustomers([response.data, ...customers]);
        // Clear the form fields
        setName('');
        setPhone('');
        setEmail('');
      })
      .catch(err => {
         console.error("Error adding customer:", err);
         setError('Failed to add customer. Please try again.');
      });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Auto Shop Customer Management</h1>
        </header>

        <main>
          {/* Form to Add New Customer */}
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Add New Customer</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Customer Name" 
                required 
                style={{ padding: '10px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="Phone Number" 
                required 
                style={{ padding: '10px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Email (Optional)" 
                style={{ padding: '10px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button type="submit" style={{ padding: '12px', fontSize: '1rem', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
                Add Customer
              </button>
            </form>
          </div>

          {/* List of Customers */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Customer List</h2>
            {loading && <p>Loading customers...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {customers.map(customer => (
                <li key={customer._id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <strong style={{ fontSize: '1.2rem', color: '#333' }}>{customer.name}</strong>
                  <p style={{ margin: '5px 0 0', color: '#555' }}>Phone: {customer.phone}</p>
                  {customer.email && <p style={{ margin: '5px 0 0', color: '#555' }}>Email: {customer.email}</p>}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;