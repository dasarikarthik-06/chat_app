import { encode } from "./helpers.js";

const createConnection = async () =>
  await Deno.connect({ port: 8000, transport: "tcp" });

const conversation = async (conn) => {
  while (true) {
    await Promise.all([
      conn.readable.pipeTo(Deno.stdout.writable),
      Deno.stdin.readable.pipeTo(conn.writable),
    ]);
  }
};

const main = async () => {
  const conn = await createConnection();
  conversation(conn);
};

main();
