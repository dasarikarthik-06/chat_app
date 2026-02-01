import { encode } from "./helpers.js";

const createConnection = async () =>
  await Deno.connect({ port: 8000, transport: "tcp" });

const conversation = async (conn) => {
  console.clear();
  const name = prompt("Enter your name: ");
  const { columns, rows } = Deno.consoleSize();
  await conn.write(encode(`${name} ${rows} ${columns}`));
  await Promise.all([
    conn.readable.pipeTo(Deno.stdout.writable),
    Deno.stdin.readable.pipeTo(conn.writable),
  ]);
};

const main = async () => {
  const conn = await createConnection();
  conversation(conn);
};

main();
