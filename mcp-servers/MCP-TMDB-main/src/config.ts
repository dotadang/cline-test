import dotenv from "dotenv";

dotenv.config();

export const TMDB_API_KEY = process.env.TMDB_API_KEY;
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";