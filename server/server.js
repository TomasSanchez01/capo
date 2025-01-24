const express = require('express');
const cors = require('cors');
const { SerialPort, ReadlineParser } = require('serialport');
const WebSocket = require('ws');

const app = express();
const HTTP_PORT = 3001;
const WS_PORT = 3002;
const SERIAL_PATH = '/dev/tty.usbserial-110';
const BAUD_RATE = 9600;

app.use(cors());

const serialPort = new SerialPort({
  path: SERIAL_PATH,
  baudRate: BAUD_RATE,
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  parser.on('data', (data) => {
    ws.send(data);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

app.post('/reset', (req, res) => {
  serialPort.write('RESET\n');
  res.status(200).send('Reset command sent to Serial');
});

app.listen(HTTP_PORT, () => {
  console.log(`Server running on http://localhost:${HTTP_PORT}`);
});