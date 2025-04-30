import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from './config.js';
// Axios instance with default configurations
const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    params: {
        api_key: TMDB_API_KEY
    }
});
// Retry logic
const axiosWithRetry = async (config, retries = 3, backoff = 300) => {
    try {
        return await tmdbClient(config);
    }
    catch (err) {
        const error = err;
        if (retries > 0 && (error.code === 'ECONNRESET' ||
            error.code === 'ETIMEDOUT' ||
            (error.response && (error.response.status >= 500 || error.response.status === 429)))) {
            console.log(`Request failed, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return axiosWithRetry(config, retries - 1, backoff * 2);
        }
        throw error;
    }
};
export async function searchMovies(query, page = 1) {
    try {
        const response = await axiosWithRetry({
            url: '/search/movie',
            params: {
                query: query,
                page: page
            }
        });
        return response.data;
    }
    catch (error) {
        const err = error;
        console.error('Error searching movies:', err.message);
        throw new Error(`Failed to search movies: ${err.message}`);
    }
}
export async function getMovieDetails(movieId) {
    try {
        const response = await axiosWithRetry({
            url: `/movie/${movieId}`,
            params: {
                append_to_response: 'credits,videos,images'
            }
        });
        return response.data;
    }
    catch (error) {
        const err = error;
        console.error('Error getting movie details:', err.message);
        throw new Error(`Failed to get movie details: ${err.message}`);
    }
}
export async function getTrendingMovies(timeWindow = 'week') {
    try {
        const response = await axiosWithRetry({
            url: `/trending/movie/${timeWindow}`
        });
        return response.data;
    }
    catch (error) {
        const err = error;
        console.error('Error getting trending movies:', err.message);
        throw new Error(`Failed to get trending movies: ${err.message}`);
    }
}
export async function getSimilarMovies(movieId) {
    try {
        const response = await axiosWithRetry({
            url: `/movie/${movieId}/similar`
        });
        return response.data;
    }
    catch (error) {
        const err = error;
        console.error('Error getting similar movies:', err.message);
        throw new Error(`Failed to get similar movies: ${err.message}`);
    }
}
