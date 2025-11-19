import { getDatabaseConfig, type DatabaseConfig } from './database.config';
import { getServerConfig, type ServerConfig } from './server.config';

export interface AppConfig {
  database: DatabaseConfig;
  server: ServerConfig;
}

export const databaseConfig = getDatabaseConfig();
export const serverConfig = getServerConfig();

export const appConfig: AppConfig = {
  database: databaseConfig,
  server: serverConfig,
};