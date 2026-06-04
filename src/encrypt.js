import { decode, encode } from "./helpers.js";

const SPECIAL_CHARS = "@ _-/.,;:'[}-+=-}]";
const NUMBER = "3691702584";
const UPPER = "QMZALTPXFBJRYKOSEHUCDIGWVN";
const LOWER = "vkgmjwqzylfuxpnthcdrbaeiso";
const CHARSET = UPPER + SPECIAL_CHARS + LOWER + NUMBER;

const isPrime = (primeCandidate) => {
  if (primeCandidate < 2) return false;
  const sqrtOfPrimeCandidate = Math.sqrt(primeCandidate);
  for (let i = 2; i <= sqrtOfPrimeCandidate; i++) {
    if (primeCandidate % i === 0) {
      return false;
    }
  }
  return true;
};

const primeAbove = (num) => {
  let candidate = num + 1;
  while (true) {
    if (isPrime(candidate)) {
      return candidate;
    }
    candidate++;
  }
};

export const encryption = () => {
  return new TransformStream({
    transform(chunk, controller) {
      const text = decode(chunk).trim();
      console.log(text);
      const initialKey = text.length;
      let encryptedText = "";
      let currentKey = initialKey;
      for (let i = 0; i < text.length; i++) {
        const charIndex = CHARSET.indexOf(text[i]);
        const encryptedIndex = (charIndex + currentKey) % CHARSET.length;
        encryptedText = encryptedText + CHARSET[encryptedIndex];
        currentKey = primeAbove(currentKey);
      }
      console.log("encryption: ", encryptedText);
      controller.enqueue(encode(encryptedText + "\n"));
    },
  });
};

export const decryption = () => {
  return new TransformStream({
    transform(chunk, controller) {
      const text = decode(chunk).trim();
      const initialKey = text.length;
      let decryptedText = "";
      let currentKey = initialKey;
      for (let i = 0; i < text.length; i++) {
        const charIndex = CHARSET.indexOf(text[i]);

        const decryptedIndex =
          (((charIndex - currentKey) % CHARSET.length) + CHARSET.length) %
          CHARSET.length;

        decryptedText = decryptedText + CHARSET[decryptedIndex];
        currentKey = primeAbove(currentKey);
      }
      console.log("decryption: ", decryptedText);
      controller.enqueue(encode(decryptedText + "\n"));
    },
  });
};

Deno.stdin.readable.pipeThrough(encryption()).pipeTo(Deno.stdout.writable);
