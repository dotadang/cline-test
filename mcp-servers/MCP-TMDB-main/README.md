# TMDB MCP Server

This project implements a Model Context Protocol (MCP) server that integrates with The Movie Database (TMDB) API. It enables AI assistants like Claude to interact with movie data, providing capabilities for searching, retrieving details, and generating content related to movies.

## Features

### Resources
- **Static Resources**:
  - `tmdb://info` - Information about TMDB API
  - `tmdb://trending` - Currently trending movies
  
- **Resource Templates**:
  - `tmdb://movie/{id}` - Detailed information about a specific movie

### Prompts
- **Movie Review**: Generate a customized movie review with specified style and rating
- **Movie Recommendation**: Get personalized movie recommendations based on genres and mood

### Tools
- **Search Movies**: Find movies by title or keywords
- **Get Trending Movies**: Retrieve trending movies for day or week
- **Get Similar Movies**: Find movies similar to a specified movie

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- TMDB API key

### Installation

1. Clone this repository
   ```
   git clone https://github.com/your-username/tmdb-mcp.git
   cd tmdb-mcp
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure your TMDB API key
   - Create a `.env` file in the project root (alternative: edit `src/config.ts` directly)
   - Add your TMDB API key: `TMDB_API_KEY=your_api_key_here`

4. Build the project
   ```
   npm run build
   ```

5. Start the server
   ```
   npm start
   ```

### Setup for Claude Desktop

1. Open Claude Desktop
2. Go to Settings > Developer tab
3. Click "Edit Config" to open the configuration file
4. Add the following to your configuration:

```json
{
  "mcpServers": {
    "tmdb-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/your/tmdb-mcp/build/index.js"]
    }
  }
}
```

5. Restart Claude Desktop

## Usage Examples

### Using Static Resources

- "What is TMDB?"
- "Show me currently trending movies"

### Using Resource Templates

- "Get details about movie with ID 550" (Fight Club)
- "Tell me about the movie with ID 155" (The Dark Knight)

### Using Prompts

- "Write a detailed review for Inception with a rating of 9/10"
- "Recommend sci-fi movies for a thoughtful mood"

### Using Tools

- "Search for movies about space exploration"
- "What are the trending movies today?"
- "Find movies similar to The Matrix"

## Development

### Project Structure

```
tmdb-mcp/
├── src/
│   ├── index.ts                # Main server file
│   ├── config.ts               # Configuration and API keys
│   ├── handlers.ts             # Request handlers
│   ├── resources.ts            # Static resources
│   ├── resource-templates.ts   # Dynamic resource templates
│   ├── prompts.ts              # Prompt definitions
│   ├── tools.ts                # Tool implementations
│   └── tmdb-api.ts             # TMDB API wrapper
├── package.json
├── tsconfig.json
└── README.md
```

### Testing

Use the MCP Inspector to test your server during development:

```
npx @modelcontextprotocol/inspector node build/index.js
```

## License

MIT

## Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/)
- [Model Context Protocol](https://modelcontextprotocol.github.io/)