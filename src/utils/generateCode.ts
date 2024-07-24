import crypto from "crypto";

export const generateCode = () => {
  return crypto.randomInt(1000, 9999).toString();
};
