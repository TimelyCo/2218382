import { nanoid } from "nanoid";

const generateShortCode = () => {
  return nanoid(5);
};

export default generateShortCode;