export interface DatabaseConfig {
  mongodb: {
    uri: string;
  };
}

import { getConfig } from './config-loader';

export function getDatabaseConfig(): DatabaseConfig {
  const config = getConfig();
  return config.database;
}