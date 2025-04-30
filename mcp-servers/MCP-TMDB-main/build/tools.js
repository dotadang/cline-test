import { searchMovies, getTrendingMovies, getSimilarMovies, getMovieDetails, } from "./tmdb-api.js";
export const tools = {
    "search-movies": {
        name: "search-movies",
        description: "Search for movies by title or keywords",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search query",
                },
                page: {
                    type: "number",
                    description: "Page number for results",
                },
            },
            required: ["query"],
        },
    },
    "get-trending": {
        name: "get-trending",
        description: "Get trending movies",
        inputSchema: {
            type: "object",
            properties: {
                timeWindow: {
                    type: "string",
                    enum: ["day", "week"],
                    description: "Time window for trending movies",
                },
            },
            required: [],
        },
    },
    "get-similar": {
        name: "get-similar",
        description: "Get similar movies to a given movie",
        inputSchema: {
            type: "object",
            properties: {
                movieId: {
                    type: "string",
                    description: "ID of the movie to find similar movies for",
                },
            },
            required: ["movieId"],
        },
    },
    "get-movie-details": {
        name: "get-movie-details",
        description: "Get detailed information about a specific movie",
        inputSchema: {
            type: "object",
            properties: {
                movieId: {
                    type: "string",
                    description: "ID of the movie to get details for",
                },
            },
            required: ["movieId"],
        },
    },
};
export const toolHandlers = {
    "search-movies": async ({ query, page = 1, }) => {
        try {
            // Return the raw results directly
            return await searchMovies(query, page);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to search movies: ${error.message}`);
            }
            throw new Error("Failed to search movies: Unknown error");
        }
    },
    "get-trending": async ({ timeWindow = "week", }) => {
        try {
            // Return the raw results directly
            return await getTrendingMovies(timeWindow);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get trending movies: ${error.message}`);
            }
            throw new Error("Failed to get trending movies: Unknown error");
        }
    },
    "get-similar": async ({ movieId }) => {
        try {
            // Return the raw results directly
            return await getSimilarMovies(movieId);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get similar movies: ${error.message}`);
            }
            throw new Error("Failed to get similar movies: Unknown error");
        }
    },
    "get-movie-details": async ({ movieId }) => {
        try {
            const result = await getMovieDetails(movieId);
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                return { text: `Failed to get movie details: ${error.message}` };
            }
            return { text: "Failed to get movie details: Unknown error" };
        }
    },
};
