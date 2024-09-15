import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2'; // Import Bar chart from react-chartjs-2
import myImage from './img/increase.png';
import myImage2 from './img/decrease.png';
import './App.css';

// Import chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

function App() {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const [newPlayerName, setNewPlayerName] = useState("");
  const [animatedIndex, setAnimatedIndex] = useState(null); // State to track which player gets animated

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  const addPlayer = () => {
    if (newPlayerName.trim() === "") return; 
    const newPlayer = {
      name: newPlayerName,
      count: 0,
      createdAt: new Date().toLocaleString() // Add the current date and time
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName(""); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const increment = (index) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].count += 1;
    setPlayers(updatedPlayers);
    setAnimatedIndex(index); // Trigger animation on this player

    if (isMobileDevice() && navigator.vibrate) {
      navigator.vibrate(200);
    }

    setTimeout(() => setAnimatedIndex(null), 500); 
  };

  const decrement = (index) => {
    const updatedPlayers = [...players];
    if (updatedPlayers[index].count > 0) {
      updatedPlayers[index].count -= 1;
      setPlayers(updatedPlayers);
      setAnimatedIndex(index); 

      if (isMobileDevice() && navigator.vibrate) {
        navigator.vibrate(200);
      }

      setTimeout(() => setAnimatedIndex(null), 500);
    }
  };

  const reset = (index) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].count = 0;
    setPlayers(updatedPlayers);
  };

  const removePlayer = (index) => {
    const updatedPlayers = players.filter((_, i) => i !== index); // Remove player by index
    setPlayers(updatedPlayers); // Update state with the new players array
  };

  const highestCount = players.length > 0 ? Math.max(...players.map(player => player.count)) : 0;

  const chartData = {
    labels: players.map(player => player.name), 
    datasets: [
      {
        label: 'Player Scores',
        data: players.map(player => player.count), 
        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
        borderColor: 'rgba(75, 192, 192, 1)', 
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true, 
      },
    },
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Player Counter with Chart</h1>

        <div className="add-player">
          <input
            type="text"
            placeholder="Enter player's name"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={handleKeyDown} // Add this event handler to detect Enter key
          />
          <button className="btn-add" onClick={addPlayer}>Add Player</button>
        </div>

        <div className="player-list">
        {players.map((player, index) => (
          <div
            key={index}
            className={`player ${player.count === highestCount && highestCount > 0 ? 'highlight' : ''} ${animatedIndex === index ? 'pulse' : ''}`}
          >
            <button className="btn-remove" onClick={() => removePlayer(index)}>X</button> {/* Positioned in top-right */}
            <h2>{player.name}</h2>
            <p className="created-date">Created: {player.createdAt}</p> {/* Display the created date */}
            <div className="counter-display">
              <h3>{player.count}</h3>
            </div>
            <div className="button-container">
              <button onClick={() => increment(index)} style={{ border: "none", background: "none" }}>
                <img src={myImage} alt="Increase" style={{ width: "70px", height: "70px" }} />
              </button>
              <button onClick={() => decrement(index)} style={{ border: "none", background: "none" }}>
                <img src={myImage2} alt="Decrease" style={{ width: "70px", height: "70px" }} />
              </button>
              <button onClick={() => reset(index)}>Reset</button>
            </div>
          </div>
        ))}

        </div>

        {players.length > 0 && (
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
