import { encode } from "./helpers.js"

const createConnection = async () =>
  await Deno.connect({ port: 8000, transport: "tcp" });

const conversation = (conn) => {
  conn.writable(encode("hello"))
}

const main = async  () => {
  const conn = await createConnection();
  conversation(conn)
};

main();
