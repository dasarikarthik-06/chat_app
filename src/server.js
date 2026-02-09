import { decode, encode } from "./helpers.js";

const createListener = async () =>
  await Deno.listen({ port: 8000, transport: "tcp" });

const formatMessage = (msg, name, cols) => {
  const message = `${name}: ${msg}`;
  return encode(message.padStart(cols));
};

const formatLeftMessage = (msg, cols) => {
  const message = ` `.repeat((cols - msg.length) / 3) + msg +
    ` `.repeat(cols - msg.length) + "\n";
  return encode(message);
};

const readName = async (buffer, conn) => {
  await conn.write(encode("Enter your name: "));
  const bytesRead = await conn.read(buffer);
  return decode(buffer.slice(0, bytesRead)).trim();
};

const agentMetaData = async (buffer, conn) => {
  const bytesRead = await conn.read(buffer);
  return decode(buffer.slice(0, bytesRead)).split(" ");
};

const readMode = async (buffer, conn) => {
  const message = `👋 Welcome to the Chat App!
  
  What would you like to do?
  1️⃣  Create a new room
  🔑  Join an existing room (any other key)
  
  Your choice:`;
  await conn.write(encode(message));
  const bytesRead = await conn.read(buffer);
  const choice = decode(buffer.slice(0, bytesRead)).trim();
  const mode = choice === "1" ? "create" : "join";
  return mode;
};

const read = async (conn) => {
  const buffer = new Uint8Array(1024);
  const [rows, cols] = await agentMetaData(buffer, conn);
  console.log({ rows, cols });
  const mode = await readMode(buffer, conn);
  const name = await readName(buffer, conn);
  console.log({ rows, cols, name, mode });
  return { name, rows, cols, mode };
};

const connections = {};

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

const createRoom = () => {
  const groupId = Math.floor(Math.random() * 100);
  console.log("create room");
  connections[groupId] = [];
  return groupId;
};

const joinRoom = () => {
  console.log("JOIN ROOM");
};

const MODES = {
  "create": createRoom,
  "join": joinRoom,
};

const handleConversation = async (conn) => {
  const { name, rows, cols, mode } = await read(conn);
  const groupId = MODES[mode]();
  connections[groupId].push({ name, conn, cols, rows });
  console.log({ groupId, connections });
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
