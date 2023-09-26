import dotenv from "dotenv";

dotenv.config();

export const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
export const MONGO_URL = process.env.MONGO_URL;
export const MONGO_ATLAS_URL = process.env.MONGO_ATLAS_URL;
export const ATLAS_DB_NAME = process.env.ATLAS_DB_NAME;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const PORT = process.env.PORT;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PW = process.env.ADMIN_PW;
export const PERSISTANCE = process.env.PERSISTANCE;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const GMAIL_CONFIG = {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PW
}