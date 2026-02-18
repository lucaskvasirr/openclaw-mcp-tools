import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Scanner } from './scanner.js';
import { SECURITY_RULES } from './rules.js';
import * as path from 'path';

const server = new Server({ name: 'security-auditor', version: '0.1.0' }, { capabilities: { tools: {} } });
const scanner = new Scanner(SECURITY_RULES);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'audit_project',
    description: 'Audits a project for security vulnerabilities.',
    inputSchema: {
      type: 'object',
      properties: { directory: { type: 'string' } },
      required: ['directory'],
    },
  }],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'audit_project') throw new Error('Unknown tool');
  const directory = request.params.arguments?.directory as string;
  const results = await scanner.scanDirectory(path.resolve(directory));
  return {
    content: [{ type: 'text', text: results.length === 0 ? '✅ Clear' : `⚠️ Found ${results.length} issues` }],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
