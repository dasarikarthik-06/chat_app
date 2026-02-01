import { decode, encode } from "./helpers.js";

const createListener = async () =>
  await Deno.listen({ port: 8000, transport: "tcp" });

const formatMessage = ({ name, cols }) => {
  console.log(cols);
  return new TransformStream({
    transform(chunk, controller) {
      const msg = decode(chunk);
      const message = `${name}: ${msg}`;
      controller.enqueue(encode(message.padStart(cols)));
    },
  });
};

const handleConversation = async (connections) => {
  await Promise.all([
    connections[0].conn.readable
      .pipeThrough(formatMessage(connections[0]))
      .pipeTo(connections[1].conn.writable),

    connections[1].conn.readable
      .pipeThrough(formatMessage(connections[1]))
      .pipeTo(connections[0].conn.writable),
  ]);

  connections.forEach((connection) => connection.close());
};



const read = async (conn) => {
  const buffer = new Uint8Array(1024);
  const bytesRead = await conn.read(buffer);
  const [name, rows, cols] = decode(buffer.slice(0, bytesRead)).split(" ");
  console.log({ name, rows, cols });
  return { name, rows, cols };
};

const main = async () => {
  const connections = [];
  const listener = await createListener();
  for await (const conn of listener) {
    const { name, rows, cols } = await read(conn);
    connections.push({ name, conn, cols, rows });
    if (connections.length === 1) {
      conn.write(encode("Waiting for other peer to connect...\n"));
      continue;
    }

    // console.clear();
    connections[0].conn.write(encode("peer joined Session started\n"));
    handleConversation(connections);
  }
};
main();
