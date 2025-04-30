import { getMovieDetails } from './tmdb-api.js';
export const resourceTemplates = [
    {
        uriTemplate: "tmdb://movie/{id}",
        name: "Movie Details",
        description: "Get details about a specific movie by ID",
        mimeType: "application/json",
    },
];
const movieDetailsExp = /^tmdb:\/\/movie\/(\d+)$/;
export const getResourceTemplate = async (uri) => {
    const movieMatch = uri.match(movieDetailsExp);
    if (movieMatch) {
        const movieId = movieMatch[1];
        return async () => {
            try {
                // Get the raw movie details from your API
                const movieDetails = await getMovieDetails(movieId);
                // Return in the correct format expected by the MCP SDK
                return {
                    contents: [
                        {
                            uri,
                            text: JSON.stringify(movieDetails, null, 2), // This should be the raw movie data
                        },
                    ],
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to fetch movie details: ${error.message}`);
                }
                throw new Error('Failed to fetch movie details: Unknown error');
            }
        };
    }
    return null;
};
