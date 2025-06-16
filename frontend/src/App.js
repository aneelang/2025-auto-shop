// =============================================================
// FILE: frontend/src/App.js
// INSTRUCTIONS: This is a completely new version of your UI.
// Replace the entire content of App.js with this code.
// =============================================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// --- Reusable Button Component ---
const ActionButton = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`bg-slate-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 ${className}`}
  >
    {children}
  </button>
);

// --- Reusable Back Button ---
const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-8 left-8 text-slate-600 hover:text-slate-900 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
        </svg>
    </button>
);


// --- Main Dashboard View ---
const HomeDashboard = ({ setView }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-2">Hi, Adithya.</h1>
      <p className="text-lg text-slate-600 mb-8">Hope you're having a marvelous day, what would you like to get started with?</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <ActionButton onClick={() => alert('Ongoing Repairs view coming soon!')}>Ongoing Repairs</ActionButton>
        <ActionButton onClick={() => alert('Schedule New Repair view coming soon!')}>Schedule New Repair</ActionButton>
        <ActionButton onClick={() => alert('My Tasks view coming soon!')}>My Tasks for Today</ActionButton>
        <ActionButton onClick={() => setView('admin')}>Admin Work</ActionButton>
      </div>
    </div>
  );
};

// --- Admin Work View ---
const AdminDashboard = ({ setView }) => {
    return (
      <div className="text-center">
        <BackButton onClick={() => setView('home')} />
        <h1 className="text-4xl font-light text-slate-800 mb-8">Admin Work</h1>
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
            <ActionButton onClick={() => setView('addCustomer')}>Add Customers</ActionButton>
            <ActionButton onClick={() => alert('Add Vehicles view coming soon!')}>Add Vehicles</ActionButton>
        </div>
      </div>
    );
};

// --- Add Customer View ---
const AddCustomerView = ({ setView }) => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    axios.post(`${API_URL}/api/customers`, { name, phone, email })
      .then(response => {
        setCustomers([response.data, ...customers]);
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
    <div className="w-full max-w-4xl mx-auto relative">
      <BackButton onClick={() => setView('admin')} />
      <h1 className="text-4xl font-light text-slate-800 mb-8 text-center">Customer Management</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-slate-700">Add New Customer</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" value={name} onChange={e => setName(e.target.value)} 
              placeholder="Customer Name" required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition"
            />
            <input 
              type="tel" value={phone} onChange={e => setPhone(e.target.value)} 
              placeholder="Phone Number" required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition"
            />
            <input 
              type="email" value={email} onChange={e => setEmail(e.target.value)} 
              placeholder="Email (Optional)" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition"
            />
            <button type="submit" className="w-full bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-transform transform hover:scale-105">
              Add Customer
            </button>
          </form>
        </div>
        
        {/* List Column */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-slate-700">Existing Customers</h2>
          {error && <p className="text-red-500">{error}</p>}
          {loading ? <p>Loading customers...</p> : (
            <ul className="space-y-3 h-96 overflow-y-auto pr-2">
              {customers.map(customer => (
                <li key={customer._id} className="bg-slate-50 p-4 rounded-lg">
                  <strong className="text-slate-800">{customer.name}</strong>
                  <p className="text-sm text-slate-600">{customer.phone}</p>
                  {customer.email && <p className="text-sm text-slate-500">{customer.email}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Main App Component (Controls Views) ---
function App() {
  const [currentView, setView] = useState('home'); // 'home', 'admin', 'addCustomer'

  const renderView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminDashboard setView={setView} />;
      case 'addCustomer':
        return <AddCustomerView setView={setView} />;
      case 'home':
      default:
        return <HomeDashboard setView={setView} />;
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 relative">
      {renderView()}
    </div>
  );
}

export default App;
