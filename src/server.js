import { decode, encode } from "./helpers.js";
import { createRoom, joinRoom } from "./room.js";
import { read } from "./metadata.js";

const createListener = async () =>
  await Deno.listen({ port: 8000, transport: "tcp" });

const formatMessage = (msg, name, cols) => {
  const message = `${name}: ${msg}`;
  return encode(message.padStart(cols));
};

export const formatSpecialMessage = (msg, cols) => {
  const message = ` `.repeat((cols - msg.length) / 3) + msg +
    ` `.repeat(cols - msg.length) + "\n";
  return encode(message);
};


const broadCastMessage = async (room, sender, message) => {
  const entries = Object.entries(room);
  for (const [i, { name, conn, cols }] of entries) {
    try {
      if (conn !== sender) await conn.write(message);
    } catch {
      room.splice(Number(i), 1);
      const message = formatSpecialMessage(`${name} left the room`, cols);
      return broadCastMessage(room, conn, message);
    }
  }
};

const MODES = {
  "create": createRoom,
  "join": joinRoom,
};

const handleConversation = async (connections, conn) => {
  const { name, rows, cols, mode } = await read(conn);
  const groupId = await MODES[mode](connections, conn, cols);

  if (!groupId) {
    conn.close();
    return;
  }

  connections[groupId].push({ name, conn, cols, rows });

  console.log(connections);
  const message = formatSpecialMessage(`${name} joined`, cols);
  broadCastMessage(connections[groupId], conn, message);

  for await (const chunk of conn.readable) {
    const originalMessage = decode(chunk).trim();
    if (originalMessage === "/exit") {
      conn.close();
      return;
    }
    const message = formatMessage(originalMessage, name, cols);
    broadCastMessage(connections[groupId], conn, message);
  }
};

const main = async () => {
const connections = {};
  const listener = await createListener();
  for await (const conn of listener) {
    handleConversation(connections, conn);
  }
};

main();
