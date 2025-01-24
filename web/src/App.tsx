import { useEffect, useState } from 'react';

const MarcadorDeGoles = () => {
  const [score, setScore] = useState({ team1: 0, team2: 0 });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3002');

    ws.onmessage = (event) => {
      const [team, score] = event.data.split(":");
      if (team === 'EQUIPO1') {
        setScore((prev) => ({ ...prev, team1: parseInt(score) }));
      } else if (team === 'EQUIPO2') {
        setScore((prev) => ({ ...prev, team2: parseInt(score) }));
      }
    };

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      ws.close();
    };

  }, []);

  const resetCounter = async () => {
    try {
      const response = await fetch('http://localhost:3001/reset', {
        method: 'POST',
      });

      if (response.ok) {
        setScore({ team1: 0, team2: 0 });
      }
    } catch (error) {
      alert('Error al resetear los contadores');
      console.log(error);
    }
  };

  return (
    <main className="w-screen">
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-900 to-blue-700">
        <div className="w-full max-w-sm rounded-lg bg-blue-800 p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-white">
            MARCADOR DE GOLES
          </h1>
          <div className="mb-4 rounded-lg bg-blue-900 px-6 py-3 text-center text-lg font-semibold text-white">
            Equipo 1: {score.team1}
          </div>
          <div className="mb-6 rounded-lg bg-blue-900 px-6 py-3 text-center text-lg font-semibold text-white">
            Equipo 2: {score.team2}
          </div>
          <button onClick={resetCounter} className="w-full rounded-lg bg-red-400 px-4 py-2 font-bold text-white transition hover:bg-red-600 cursor-pointer">
            Resetear Contadores
          </button>
        </div>
        <footer className="absolute bottom-4 text-center text-sm text-white">
          <p>
            Desarrollado por <strong>Tomas</strong>. Todos los derechos
            reservados © 2025.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default MarcadorDeGoles;
