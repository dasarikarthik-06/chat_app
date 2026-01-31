import {  encode } from "./helpers.js";

const createListener = async () =>
  await Deno.listen({ port: 8000, transport: "tcp" });

const handleConversation = async (connections) => {
    await Promise.all([
      connections[0].readable.pipeTo(connections[1].writable),
      connections[1].readable.pipeTo(connections[0].writable),
    ]);

  connections.forEach(connection => connection.close())
};

const main = async () => {
  const connections = [];
  const listener = await createListener();
  for await (const conn of listener) {
    connections.push(conn);
    if (connections.length === 1) {
      conn.write(encode("Waiting for other peer to connect...\n"));
      continue;
    }
    console.clear();
    connections[0].write(encode("peer joined Session started\n"));
    handleConversation(connections);
  }
};
main();