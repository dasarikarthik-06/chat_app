import { encode } from "./helpers.js";

const createConnection = async () =>
  await Deno.connect({ port: 8000, transport: "tcp" });

const conversation = async (conn) => {
  console.clear();
  const { columns, rows } = Deno.consoleSize();
  await conn.write(encode(`${rows} ${columns}`));

  await Promise.all([
    conn.readable.pipeTo(Deno.stdout.writable),
    Deno.stdin.readable.pipeTo(conn.writable),
  ]).catch(() => Deno.exit());
};

const main = async () => {
  const conn = await createConnection();
  await conversation(conn);
};

main();
