const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('DevOps Pipeline Live 🔥');
});

server.listen(4000, '0.0.0.0', () => {
  console.log('Server is running on port 4000');
});
