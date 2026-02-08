import { decode, encode } from "./helpers.js";

const createListener = async () =>
  await Deno.listen({ port: 8000, transport: "tcp" });

const formatMessage = (msg, name, cols) => {
  const message = `${name}: ${msg}`;
  return encode(message.padStart(cols));
};

const formatLeftMessage = (msg, cols) => {
  const message = ` `.repeat((cols - msg.length) / 3) + msg +
    ` `.repeat((cols - msg.length) / 2) + "\n";
  return encode(message);
};

const readName = async (buffer, conn) => {
  await conn.write(encode("Enter your name: "));
  const bytesReadForName = await conn.read(buffer);
  return decode(buffer.slice(0, bytesReadForName)).trim();
};

const agentConsoleSize = async (buffer, conn) => {
  const bytesRead = await conn.read(buffer);
  return decode(buffer.slice(0, bytesRead)).split(" ");
};

const read = async (conn) => {
  const buffer = new Uint8Array(1024);
  const [rows, cols] = await agentConsoleSize(buffer, conn);
  const name = await readName(buffer, conn);
  console.log({ name, rows, cols });
  return { name, rows, cols };
};

const connections = [];

const broadCastMessage = (connections, sender, message) => {
  connections.forEach(async ({ name, conn, cols }, i) => {
    try {
      if (conn !== sender) await conn.write(message);
    } catch {
      connections.splice(i, 1);
      const message = formatLeftMessage(`${name} left the room`, cols);
      return broadCastMessage(connections, conn, message);
    }
  });
};

const handleConversation = async (conn) => {
  const { name, rows, cols } = await read(conn);
  connections.push({ name, conn, cols, rows });
  for await (const chunk of conn.readable) {
    const message = formatMessage(decode(chunk), name, cols);
    broadCastMessage(connections, conn, message);
  }
};

const main = async () => {
  const listener = await createListener();
  for await (const conn of listener) {
    handleConversation(conn);
  }
};
main();
