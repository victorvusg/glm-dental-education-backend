import dotenv from 'dotenv';

dotenv.config();

const env = {
  mongoUri: process.env.ATLAS_URI || '',
  port: process.env.PORT || 9090,
  jwtSecret: process.env.JWT_SECRET || '',
  llamaApi: process.env.LLAMA_URL || '',
};

export default env;
