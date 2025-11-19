import * as fs from 'fs';
import * as path from 'path';

interface ConfigFile {
  database: {
    mongodb: {
      uri: string;
    };
  };
  server: {
    port: number;
    nodeEnv: string;
    cors: {
      origin: boolean | string[];
      methods: string;
      credentials: boolean;
    };
    validation: {
      whitelist: boolean;
      transform: boolean;
      forbidNonWhitelisted: boolean;
    };
  };
}

let configCache: ConfigFile | null = null;

export function loadConfig(): ConfigFile {
  if (configCache) {
    return configCache;
  }

  try {
    const configPath = path.join(process.cwd(), 'config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    configCache = JSON.parse(configData) as ConfigFile;
    return configCache;
  } catch (error) {
    console.error('Error loading config.json:', error);
    process.exit(1);
  }
}

export function getConfig(): ConfigFile {
  if (!configCache) {
    return loadConfig();
  }
  return configCache;
}