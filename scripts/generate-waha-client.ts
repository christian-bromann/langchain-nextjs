#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface OpenAPISpec {
    paths: Record<string, Record<string, any>>;
    components: {
        schemas: Record<string, any>;
    };
}

function generateTypes(spec: OpenAPISpec): string {
    let output = '// Auto-generated from waha-swagger.json\n';
    output += '// Do not edit manually\n\n';

    // Generate type definitions from schemas
    const schemas = spec.components?.schemas || {};

    for (const [name, schema] of Object.entries(schemas)) {
        if (schema.type === 'object') {
            output += `export interface ${name} {\n`;

            const properties = schema.properties || {};
            const required = schema.required || [];

            for (const [propName, propSchema] of Object.entries(properties)) {
                const prop = propSchema as any;
                const isRequired = required.includes(propName);
                const optional = isRequired ? '' : '?';

                let type = 'any';
                if (prop.type === 'string') type = 'string';
                else if (prop.type === 'number' || prop.type === 'integer') type = 'number';
                else if (prop.type === 'boolean') type = 'boolean';
                else if (prop.type === 'array') {
                    const itemType = prop.items?.$ref ? prop.items.$ref.split('/').pop() : 'any';
                    type = `${itemType}[]`;
                } else if (prop.$ref) {
                    type = prop.$ref.split('/').pop();
                }

                if (prop.description) {
                    output += `  /** ${prop.description} */\n`;
                }
                output += `  ${propName}${optional}: ${type};\n`;
            }

            output += '}\n\n';
        } else if (schema.enum) {
            output += `export type ${name} = ${schema.enum.map((v: string) => `'${v}'`).join(' | ')};\n\n`;
        }
    }

    return output;
}

function generateClient(spec: OpenAPISpec): string {
    let output = '';

    output += `
export interface WahaClientConfig {
  baseUrl: string;
  apiKey: string;
}

export class WahaClient {
  private config: WahaClientConfig;

  constructor(config: WahaClientConfig) {
    this.config = config;
  }

  private async request<T>(
    path: string,
    method: string = 'GET',
    body?: any
  ): Promise<T> {
    const url = \`\${this.config.baseUrl}\${path}\`;
    const headers: Record<string, string> = {
      'X-Api-Key': this.config.apiKey,
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(\`WAHA API Error: \${error}\`);
    }

    return response.json();
  }
`;

    // Generate methods for key endpoints
    const paths = spec.paths || {};

    // Focus on the most common endpoints
    const endpointsToGenerate = [
        { path: '/api/sendText', method: 'post', name: 'sendText' },
        { path: '/api/sendImage', method: 'post', name: 'sendImage' },
        { path: '/api/sendFile', method: 'post', name: 'sendFile' },
        { path: '/api/sendVoice', method: 'post', name: 'sendVoice' },
        { path: '/api/sendVideo', method: 'post', name: 'sendVideo' },
        { path: '/api/sendLocation', method: 'post', name: 'sendLocation' },
        { path: '/api/sendLinkPreview', method: 'post', name: 'sendLinkPreview' },
        { path: '/api/sendSeen', method: 'post', name: 'sendSeen' },
        { path: '/api/startTyping', method: 'post', name: 'startTyping' },
        { path: '/api/stopTyping', method: 'post', name: 'stopTyping' },
        { path: '/api/sessions', method: 'get', name: 'getSessions' },
        { path: '/api/sessions', method: 'post', name: 'createSession' },
    ];

    for (const endpoint of endpointsToGenerate) {
        const pathSpec = paths[endpoint.path]?.[endpoint.method];
        if (!pathSpec) continue;

        const requestBodySchema = pathSpec.requestBody?.content?.['application/json']?.schema?.$ref;
        const responseSchema = pathSpec.responses?.['201']?.content?.['application/json']?.schema?.$ref ||
            pathSpec.responses?.['200']?.content?.['application/json']?.schema?.$ref;

        const requestType = requestBodySchema ? requestBodySchema.split('/').pop() : 'any';
        const responseType = responseSchema ? responseSchema.split('/').pop() : 'any';

        const hasBody = endpoint.method === 'post' || endpoint.method === 'put';

        if (hasBody) {
            output += `
  /**
   * ${pathSpec.summary || endpoint.name}
   */
  async ${endpoint.name}(data: ${requestType}): Promise<${responseType}> {
    return this.request<${responseType}>('${endpoint.path}', '${endpoint.method.toUpperCase()}', data);
  }
`;
        } else {
            output += `
  /**
   * ${pathSpec.summary || endpoint.name}
   */
  async ${endpoint.name}(): Promise<${responseType}> {
    return this.request<${responseType}>('${endpoint.path}', '${endpoint.method.toUpperCase()}');
  }
`;
        }
    }

    output += '}\n';

    return output;
}

function generateHelperFunctions(): string {
    return `
// Helper function for backward compatibility
export async function sendWhatsappMessage(
  session: string,
  to: string,
  text: string
): Promise<WAMessage> {
  const client = new WahaClient({
    baseUrl: process.env.NEXT_PUBLIC_WAHA_API_URL || '',
    apiKey: process.env.NEXT_PUBLIC_WAHA_API_KEY || '',
  });

  return client.sendText({
    session,
    chatId: to,
    text,
  });
}
`;
}

async function main() {
    const swaggerPath = path.join(process.cwd(), 'waha-swagger.json');
    const outputPath = path.join(process.cwd(), 'lib', 'waha.ts');

    console.log('Reading OpenAPI spec from:', swaggerPath);
    const spec: OpenAPISpec = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

    console.log('Generating TypeScript types and client...');

    let output = '';
    output += generateTypes(spec);
    output += generateClient(spec);
    output += generateHelperFunctions();

    console.log('Writing to:', outputPath);
    fs.writeFileSync(outputPath, output, 'utf-8');

    console.log('✅ Successfully generated WAHA client library!');
}

main().catch(console.error);
