import dbClient from '../utils/db.js'; // Use the dbClient instance from db.js
import { checkRedisConnection } from '../utils/redis.js';

class AppController {
  // GET /status
  static async getStatus(req, res) {
    try {
      const dbStatus = dbClient.isAlive();  // Check DB connection status using dbClient
      const redisStatus = await checkRedisConnection();

      res.status(200).json({ redis: redisStatus, db: dbStatus });
    } catch (error) {
      res.status(500).json({ error: 'Error checking system status' });
    }
  }

  // GET /stats
  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers(); // Use dbClient to count users
      const filesCount = await dbClient.nbFiles(); // Use dbClient to count files

      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching stats' });
    }
  }
}

export default AppController;
