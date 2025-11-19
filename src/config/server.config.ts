export interface ServerConfig {
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
}

import { getConfig } from './config-loader';

export function getServerConfig(): ServerConfig {
  const config = getConfig();
  return config.server;
}