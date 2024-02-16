const MainClient = require("./swayfy.js");
const client = new MainClient();

client.connect();

module.exports = client;

var ping;

client.on('messageCreate', (message) => {
   ping = Date.now() - message.createdTimestamp
})

const express = require('express');
const app = express();
const port = 6969;

app.get('/api/ping', (req, res) => {
  res.json({ ping: ping ? ping : 'error' });
});

app.listen(port, () => {
  console.log(`api port: ${port}`);
});
