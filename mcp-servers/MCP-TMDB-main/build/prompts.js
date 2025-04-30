export const prompts = {
    "movie-review": {
        name: "movie-review",
        description: "Create a movie review based on provided details",
        arguments: [
            {
                name: "title",
                description: "Title of the movie",
                required: true,
            },
            {
                name: "rating",
                description: "Your rating of the movie (1-10)",
                required: true,
            },
            {
                name: "style",
                description: "Review style (brief, detailed, critical)",
                required: false,
            },
        ],
    },
    "movie-recommendation": {
        name: "movie-recommendation",
        description: "Get personalized movie recommendations",
        arguments: [
            {
                name: "genres",
                description: "Preferred genres (comma-separated)",
                required: true,
            },
            {
                name: "mood",
                description: "Current mood (happy, thoughtful, excited, etc.)",
                required: false,
            },
            {
                name: "avoidGenres",
                description: "Genres to avoid (comma-separated)",
                required: false,
            },
        ],
    },
};
export const promptHandlers = {
    "movie-review": ({ title, rating, style = "detailed", }) => {
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Write a ${style} review for the movie "${title}" with a rating of ${rating}/10. Include your thoughts on the plot, characters, direction, and overall experience.`,
                    },
                },
            ],
        };
    },
    "movie-recommendation": ({ genres, mood = "any", avoidGenres = "", }) => {
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Recommend movies in the following genres: ${genres}. I'm in a ${mood} mood. Please avoid these genres if possible: ${avoidGenres}. Include a brief description of why you're recommending each movie.`,
                    },
                },
            ],
        };
    },
};
