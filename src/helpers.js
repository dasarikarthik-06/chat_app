const encoder = new TextEncoder()
export const encode = text => encoder.encode(text)

const decoder = new TextDecoder();
export const decode = text => decoder.decode(text);