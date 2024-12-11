import { checkDbConnection } from '../utils/db.js';
import { checkRedisConnection } from '../utils/redis.js';
import { MongoClient } from 'mongodb';

class AppController {
  // GET /status
  static async getStatus(req, res) {
    try {
      const dbStatus = await checkDbConnection();
      const redisStatus = await checkRedisConnection();

      res.status(200).json({ redis: redisStatus, db: dbStatus });
    } catch (error) {
      res.status(500).json({ error: 'Error checking system status' });
    }
  }

  // GET /stats
  static async getStats(req, res) {
    try {
      const usersCount = await AppController.countUsers();
      const filesCount = await AppController.countFiles();

      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching stats' });
    }
  }

  // Helper method to count users
  static async countUsers() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const usersCollection = db.collection('users');
    const usersCount = await usersCollection.countDocuments();
    await client.close();
    return usersCount;
  }

  // Helper method to count files
  static async countFiles() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const filesCollection = db.collection('files');
    const filesCount = await filesCollection.countDocuments();
    await client.close();
    return filesCount;
  }
}

export default AppController;
