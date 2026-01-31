import { decode, encode } from "./helpers.js";

const createListener = async () =>
  await Deno.listen({ port: 8000, transport: "tcp" });

const handleConversation = async (conn) => {
  const buffer = new Uint8Array(1024)
  const byteRead = await conn.read(buffer);
  const message = decode(buffer.slice(0, byteRead))
  console.log(message);
  conn.write(encode("hello back"));
}

const main = async () => {
  const listener = await createListener();
  for await(const conn of listener) {
   handleConversation(conn) 
  }
};

main();