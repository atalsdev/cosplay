import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', err => console.error('Redis Client Error', err));

export async function getRedisClient() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

export async function getCachedData(key: string) {
  const redis = await getRedisClient();
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setCachedData(key: string, data: any, ttl: number = 3600) {
  const redis = await getRedisClient();
  await redis.setEx(key, ttl, JSON.stringify(data));
} 