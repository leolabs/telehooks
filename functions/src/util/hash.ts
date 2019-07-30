import * as firebase from "firebase-functions";
import { crc32 } from "crc";

const SALT = firebase.config().telegram.salt;

export const hash = (id: string) => crc32(`${id}-${SALT}`).toString(16);
