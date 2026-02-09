import { decode, encode } from "./helpers.js";

const readName = async (buffer, conn) => {
  await conn.write(encode("Enter your name: "));
  const bytesRead = await conn.read(buffer);
  return decode(buffer.slice(0, bytesRead)).trim();
};

const agentMetaData = async (buffer, conn) => {
  const bytesRead = await conn.read(buffer);
  return decode(buffer.slice(0, bytesRead)).trim().split(" ");
};

const readMode = async (buffer, conn) => {
  const message = `👋 Welcome to the Chat App!

Please choose an option:

  1️⃣  Create a new room
  ➕  Join an existing room (press any other key)

Your choice:`;
  await conn.write(encode(message));
  const bytesRead = await conn.read(buffer);
  const choice = decode(buffer.slice(0, bytesRead)).trim();
  const mode = choice === "1" ? "create" : "join";
  return mode;
};

export const read = async (conn) => {
  const buffer = new Uint8Array(1024);
  const [rows, cols] = await agentMetaData(buffer, conn);
  const mode = await readMode(buffer, conn);
  const name = await readName(buffer, conn);
  return { name, rows, cols, mode };
};
