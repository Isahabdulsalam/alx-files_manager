import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async get(key) {
    await this.connect();
    return this.client.get(key);
  }

  async set(key, value) {
    await this.connect();
    return this.client.set(key, value);
  }

  async disconnect() {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }
}

export default new RedisClient();
