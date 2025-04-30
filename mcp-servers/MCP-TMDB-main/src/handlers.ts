import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { resourceHandlers, resources } from "./resources.js";
import { getResourceTemplate, resourceTemplates } from "./resource-templates.js";
import { promptHandlers, prompts } from "./prompts.js";
import { toolHandlers, tools } from "./tools.js";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";

export const setupHandlers = (server: Server): void => {
  // Resource handlers
  server.setRequestHandler(
    ListResourcesRequestSchema,
    async () => ({ resources }),
  );
  
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
    resourceTemplates,
  }));
  
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    // Using type assertion to tell TypeScript this is a valid key
    const resourceHandler = resourceHandlers[uri as keyof typeof resourceHandlers];
    if (resourceHandler) return await resourceHandler();
    
    const resourceTemplateHandler = await getResourceTemplate(uri);
    if (resourceTemplateHandler) return await resourceTemplateHandler();
    
    throw new Error(`Resource not found: ${uri}`);
  });

  // Prompt handlers
  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: Object.values(prompts),
  }));
  
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    // Using type assertion to tell TypeScript this is a valid key
    const promptHandler = promptHandlers[name as keyof typeof promptHandlers];
    
    if (promptHandler) {
      return promptHandler(args as any);
    }
    
    throw new Error(`Prompt not found: ${name}`);
  });

  // Tool handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: Object.values(tools),
  }));

  // This is the key fix - we need to format the response properly
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const { name, arguments: args } = request.params;
      // Using type assertion to tell TypeScript this is a valid key
      const handler = toolHandlers[name as keyof typeof toolHandlers];

      if (!handler) throw new Error(`Tool not found: ${name}`);

      // Execute the handler but wrap the response in the expected format
      const result = await handler(args as any);
      
      // Return in the format expected by the SDK
      return {
        tools: [{
          name,
          inputSchema: {
            type: "object",
            properties: {} // This would ideally be populated with actual schema
          },
          description: `Tool: ${name}`,
          result
        }]
      };
    } catch (error) {
      // Properly handle errors
      if (error instanceof Error) {
        return {
          tools: [],
          error: error.message
        };
      }
      return {
        tools: [],
        error: "An unknown error occurred"
      };
    }
  });
};