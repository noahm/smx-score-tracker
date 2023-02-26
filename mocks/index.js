const { setupServer } = require("msw/node");
// const { playerScoresHandler } = require("./statmaniax");

const server = setupServer();

server.listen();
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
