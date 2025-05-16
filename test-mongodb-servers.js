const net = require("net");

const servers = [
  { host: "cluster0-shard-00-00.gdmxojr.mongodb.net", port: 27017 },
  { host: "cluster0-shard-00-01.gdmxojr.mongodb.net", port: 27017 },
  { host: "cluster0-shard-00-02.gdmxojr.mongodb.net", port: 27017 },
];

async function testServer(host, port) {
  return new Promise((resolve) => {
    console.log(`Testing connection to ${host}:${port}...`);
    const socket = new net.Socket();

    socket.setTimeout(5000);

    socket.on("connect", () => {
      console.log(`Successfully connected to ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      console.log(`Connection to ${host}:${port} timed out`);
      socket.destroy();
      resolve(false);
    });

    socket.on("error", (error) => {
      console.log(`Error connecting to ${host}:${port}: ${error.message}`);
      resolve(false);
    });

    socket.connect(port, host);
  });
}

async function testAllServers() {
  for (const server of servers) {
    const result = await testServer(server.host, server.port);
    console.log(
      `Connection to ${server.host}:${server.port} - ${
        result ? "SUCCESS" : "FAILED"
      }`
    );
  }
}

testAllServers();
