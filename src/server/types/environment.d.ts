declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SSL_KEY: string
      SSL_CERT: string
      NODE_ENV: 'development' | 'production'
      ARCHIVE_DIR: string,
      DB_NAME: string,
      DB_USER: string,
      DB_PASSWORD: string,
      DB_HOST: string,
      DB_PORT: string
    }
  }
}

export {}
