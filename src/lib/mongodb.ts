import { MongoClient } from 'mongodb';

const getEnvVar = (key: string) => {
  if (typeof window !== 'undefined' && (window as any).__ENV) {
    return (window as any).__ENV[key];
  }
  return import.meta.env[key] || process.env[key];
};

const MONGODB_URI = getEnvVar('MONGODB_URI');

let client: MongoClient | null = null;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    if (client) {
      await client.db().command({ ping: 1 });
      return client;
    }

    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    console.log('✅ Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    await client.connect();
    return client;
  }
}

export async function getCollection(collectionName: string) {
  try {
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    return db.collection(collectionName);
  } catch (error) {
    console.error('Error getting collection:', error);
    throw new Error(`Failed to get collection: ${collectionName}`);
  }
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
  }
} 