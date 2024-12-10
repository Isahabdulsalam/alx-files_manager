import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
    static async getStatus(req, res) {
        // Check if Redis and DB are alive
        const redisStatus = redisClient.isAlive();
        const dbStatus = dbClient.isAlive();

        res.status(200).json({ redis: redisStatus, db: dbStatus });
    }import dbClient from '../utils/db';
    import redisClient from '../utils/redis';
    
    const AppController = {
      async getStatus(req, res) {
        const redisStatus = redisClient.isAlive();
        const dbStatus = dbClient.isAlive();
    
        if (redisStatus && dbStatus) {
          res.status(200).json({ redis: true, db: true });
        } else {
          res.status(500).json({ redis: redisStatus, db: dbStatus });
        }
      },
    
      async getStats(req, res) {
        try {
          const usersCount = await dbClient.nbUsers();
          const filesCount = await dbClient.nbFiles();
          res.status(200).json({ users: usersCount, files: filesCount });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      },
    };
    
    export default AppController;

    static async getStats(req, res) {
        try {
            // Count the number of users and files in the database
            const usersCount = await dbClient.database.collection('users').countDocuments();
            const filesCount = await dbClient.database.collection('files').countDocuments();

            res.status(200).json({ users: usersCount, files: filesCount });
        } catch (error) {
            res.status(500).json({ error: 'Unable to retrieve stats' });
        }
    }
}

export default AppController;
