const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const app = express();

const PORT = 3000; // Puerto del servidor web
let goles = { equipo1: 0, equipo2: 0 };

// Configurar puerto serie
const serialPort = new SerialPort({
  path: 'COM3', // Cambia 'COM3' por el puerto correcto de tu Arduino
  baudRate: 9600,
});

// Configurar el parser para leer líneas completas
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Leer datos del puerto serie
parser.on('data', (data) => {
  console.log('Dato recibido:', data.trim());
  if (data.includes('EQUIPO1:')) {
    goles.equipo1 = parseInt(data.split(':')[1]);
  } else if (data.includes('EQUIPO2:')) {
    goles.equipo2 = parseInt(data.split(':')[1]);
  }
});

// Configurar servidor para servir la página HTML
app.use(express.static('public'));

// Endpoint para obtener los datos de los goles
app.get('/goles', (req, res) => {
  res.json(goles);
});

// Iniciar servidor en la red local
app.listen(PORT, 'localhost', () => {
  console.log(`Servidor web corriendo en http://192.168.100.8:${PORT}`);
  console.log(
    'Para conectarte desde otro dispositivo, usa la IP local de este equipo.'
  );
});

// Endpoint para resetear los contadores
app.post('/reset', (req, res) => {
  serialPort.write('RESET\n', (err) => {
    if (err) {
      console.error('Error al enviar comando RESET:', err);
      res.status(500).send('Error al resetear los contadores');
    } else {
      console.log('Comando RESET enviado al Arduino');
      goles.equipo1 = 0;
      goles.equipo2 = 0;
      res.status(200).send('Contadores reseteados');
    }
  });
});
