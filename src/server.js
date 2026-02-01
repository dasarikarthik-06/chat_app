import { decode, encode } from "./helpers.js";

const createListener = async () =>
  await Deno.listen({ port: 8000, transport: "tcp" });

const formatMessage = (msg, name, cols) => {
  const message = `${name}: ${msg}`;
  return message.padStart(cols);
};

const read = async (conn) => {
  const buffer = new Uint8Array(1024);
  const bytesRead = await conn.read(buffer);
  const [name, rows, cols] = decode(buffer.slice(0, bytesRead)).split(" ");
  console.log({ name, rows, cols });
  return { name, rows, cols };
};

const connections = [];

const handleConversation = async (conn) => {
  const { name, rows, cols } = await read(conn);
  connections.push({ name, conn, cols, rows });
  let personLeft;
  for await (const chunk of conn.readable) {
    try {
      for (const connection of connections) {
        const message = decode(chunk);
        if (connection.conn !== conn) {
          connection.conn.write(encode(formatMessage(message, name, cols)));
        }
      }
    } catch {
      // personLeft = connection
      // cons
    }
  }
};

const main = async () => {
  const listener = await createListener();
  for await (const conn of listener) {
    // console.clear();
    handleConversation(conn);
  }
};
main();
