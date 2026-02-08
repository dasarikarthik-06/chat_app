import { encode } from "./helpers.js";

const createConnection = async () =>
  await Deno.connect({ port: 8000, transport: "tcp" });

const conversation = async (conn) => {
  console.clear();
  try {
    const { columns, rows } = Deno.consoleSize();
    await conn.write(encode(`${rows} ${columns}`));
    await Promise.all([
      conn.readable.pipeTo(Deno.stdout.writable),
      Deno.stdin.readable.pipeTo(conn.writable),
    ]);
  } catch (e) {
    Deno.exit()
  }
};

const main = async () => {
  try {
    const conn = await createConnection();
    conversation(conn);
  } catch (e) {
    console.log(e);
  }
};

main();
