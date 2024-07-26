import './apollo_index.js'
import './src/models/index.js'
import http from 'https'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.NODE_DOCKER_PORT || 8080;


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

server.listen(PORT, () => {
  console.log(`Server running at ${PORT}/`);
});