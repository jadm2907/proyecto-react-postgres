import React, { useEffect, useState } from 'react';
import Usuarios from './Usuarios';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  function App() {
    return (
      <div className="App">
        <Usuarios />
      </div>
    );
  }
}

export default App;