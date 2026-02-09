import { decode, encode } from "./helpers.js";
import { formatSpecialMessage } from "./server.js";

const writeGroupId = async (conn, cols, groupId) => {
  const message = `\x1B[1m Group id: ${groupId} \x1b[0m`;
  await conn.write(formatSpecialMessage(message, cols));
};

export const createRoom = async (connections, conn, cols) => {
  let groupId;
  while (true) {
    groupId = Math.floor(Math.random() * 100);
    if (connections[groupId] === undefined) {
      break;
    }
  }
  console.log("create room");
  await writeGroupId(conn, cols, groupId);
  connections[groupId] = [];
  return groupId;
};

export const joinRoom = async (connections, conn, cols) => {
  const buffer = new Uint8Array(1024);
  await conn.write(encode("Enter the group Id: "));
  const bytesRead = await conn.read(buffer);
  const groupId = decode(buffer.slice(0, bytesRead)).trim();
  if (!connections[groupId]) {
    conn.write(encode("Invalid group Id\n"));
    return false;
  }
  await writeGroupId(conn, cols, groupId);
  return groupId;
};
