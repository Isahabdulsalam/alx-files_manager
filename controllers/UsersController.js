import crypto from 'crypto';
import dbClient from '../utils/db.js';

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        // Check for missing email or password
        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }
        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        // Check if the email already exists in the database
        const existingUser = await dbClient.database.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Already exist' });
        }

        // Hash the password using SHA1
        const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

        // Insert the new user into the database
        const result = await dbClient.database.collection('users').insertOne({
            email,
            password: hashedPassword,
        });

        // Return the created user details
        return res.status(201).json({ id: result.insertedId, email });
    }
}

export default UsersController;
