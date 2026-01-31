// import { decode, encode } from "./helpers.js";

const createListener = async () =>
  await Deno.listen({ port: 8000, transport: "tcp" });

const handleConversation = async (conn) => {
  while (true) {
    await Promise.all([
      conn.readable.pipeTo(Deno.stdout.writable),
      Deno.stdin.readable.pipeTo(conn.writable),
    ]);
  }
};

const main = async () => {
  const listener = await createListener();
  for await (const conn of listener) {
    handleConversation(conn);
  }
};

main();
