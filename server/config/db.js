import mongoose from 'mongoose';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let memoryServer = null;

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (uri) {
    await mongoose.connect(uri);
    console.log(`[db] connected to MongoDB at ${uri.replace(/\/\/.*@/, '//***@')}`);
    return { managed: false, persistent: true };
  }

  // No MONGO_URI: run a local, disk-backed MongoDB (wiredTiger) so data survives
  // restarts and crashes. Set MONGO_URI (e.g. a MongoDB Atlas string) to override.
  const dbPath = resolve(process.env.LOCAL_DB_PATH || resolve(__dirname, '..', 'data', 'db'));
  mkdirSync(dbPath, { recursive: true });

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: 'wiredTiger' },
  });
  await mongoose.connect(memoryServer.getUri('codefolio'));
  console.log(`[db] MONGO_URI not set - using local persistent MongoDB at ${dbPath} (data survives restarts)`);
  return { managed: true, persistent: true };
}

export async function disconnectDB() {
  await mongoose.disconnect();
  // doCleanup:false keeps the on-disk data intact for the next start.
  if (memoryServer) await memoryServer.stop({ doCleanup: false });
}
