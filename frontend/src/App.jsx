import React from 'react';
import Canvas from './components/Canvas';
import 'reactflow/dist/style.css';

function App() {
  const handleSave = () => {
    // In a real app, this would extract the React Flow instance data and POST to /api/pipelines
    alert('Pipeline saved successfully!');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>NexusFlow</h1>
        <button onClick={handleSave}>Save Pipeline</button>
      </header>
      <main className="main-content">
        <Canvas />
      </main>
    </div>
  );
}

export default App;
