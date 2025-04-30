import { getTrendingMovies } from './tmdb-api.js';
export const resources = [
    {
        uri: "tmdb://info",
        name: "TMDB Info",
        description: "Information about The Movie Database API",
        mimeType: "text/plain",
    },
    {
        uri: "tmdb://trending",
        name: "Trending Movies",
        description: "Currently trending movies on TMDB",
        mimeType: "application/json",
    }
];
export const resourceHandlers = {
    "tmdb://info": async () => ({
        contents: [
            {
                uri: "tmdb://info",
                text: "The Movie Database (TMDB) is a popular, user-editable database for movies and TV shows. This MCP server provides access to TMDB data through resources, prompts, and tools.",
            },
        ],
    }),
    "tmdb://trending": async () => {
        const trendingData = await getTrendingMovies();
        return {
            contents: [
                {
                    uri: "tmdb://trending",
                    text: JSON.stringify(trendingData, null, 2),
                },
            ],
        };
    },
};
