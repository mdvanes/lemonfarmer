import { config } from "dotenv/mod.ts";

export const options = {
  headers: {
    "Content-Type": "application/json",
    // During alpha token expires every 2 weeks, then you have to re-register by calling http://localhost:8000/api/init and storing the resulting token in .env
    Authorization: `Bearer ${config().TOKEN}`,
  },
};
