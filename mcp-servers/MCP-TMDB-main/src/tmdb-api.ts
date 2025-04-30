import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from './config.js';

// Response types
interface MovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  [key: string]: any;
}

interface SearchMoviesResponse {
  page: number;
  results: MovieResult[];
  total_results: number;
  total_pages: number;
}

interface MovieDetailsResponse extends MovieResult {
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      [key: string]: any;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
      [key: string]: any;
    }>;
  };
  videos: {
    results: Array<{
      id: string;
      key: string;
      site: string;
      type: string;
      [key: string]: any;
    }>;
  };
  images: {
    backdrops: Array<{
      file_path: string;
      width: number;
      height: number;
      [key: string]: any;
    }>;
    posters: Array<{
      file_path: string;
      width: number;
      height: number;
      [key: string]: any;
    }>;
  };
}

// Axios instance with default configurations
const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  params: {
    api_key: TMDB_API_KEY
  }
});

// Retry logic
const axiosWithRetry = async <T>(
  config: AxiosRequestConfig, 
  retries: number = 3, 
  backoff: number = 300
): Promise<AxiosResponse<T>> => {
  try {
    return await tmdbClient(config);
  } catch (err) {
    const error = err as AxiosError;
    
    if (retries > 0 && (
      error.code === 'ECONNRESET' || 
      error.code === 'ETIMEDOUT' || 
      (error.response && (error.response.status >= 500 || error.response.status === 429))
    )) {
      console.log(`Request failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return axiosWithRetry<T>(config, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export async function searchMovies(query: string, page: number = 1): Promise<SearchMoviesResponse> {
  try {
    const response = await axiosWithRetry<SearchMoviesResponse>({
      url: '/search/movie',
      params: {
        query: query,
        page: page
      }
    });
    return response.data;
  } catch (error) {
    const err = error as Error;
    console.error('Error searching movies:', err.message);
    throw new Error(`Failed to search movies: ${err.message}`);
  }
}

export async function getMovieDetails(movieId: number | string): Promise<MovieDetailsResponse> {
  try {
    const response = await axiosWithRetry<MovieDetailsResponse>({
      url: `/movie/${movieId}`,
      params: {
        append_to_response: 'credits,videos,images'
      }
    });
    return response.data;
  } catch (error) {
    const err = error as Error;
    console.error('Error getting movie details:', err.message);
    throw new Error(`Failed to get movie details: ${err.message}`);
  }
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<SearchMoviesResponse> {
  try {
    const response = await axiosWithRetry<SearchMoviesResponse>({
      url: `/trending/movie/${timeWindow}`
    });
    return response.data;
  } catch (error) {
    const err = error as Error;
    console.error('Error getting trending movies:', err.message);
    throw new Error(`Failed to get trending movies: ${err.message}`);
  }
}

export async function getSimilarMovies(movieId: number | string): Promise<SearchMoviesResponse> {
  try {
    const response = await axiosWithRetry<SearchMoviesResponse>({
      url: `/movie/${movieId}/similar`
    });
    return response.data;
  } catch (error) {
    const err = error as Error;
    console.error('Error getting similar movies:', err.message);
    throw new Error(`Failed to get similar movies: ${err.message}`);
  }
}