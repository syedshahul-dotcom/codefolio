import 'dotenv/config';
import { MongoClient } from 'mongodb';

// One-time migration: copies all data from the in-memory dev DB into MONGO_URI (e.g. Atlas).
// Idempotent - safe to run more than once (upserts by _id).
const SOURCE_URI = process.env.SOURCE_URI || 'mongodb://127.0.0.1:30439/codefolio';
const TARGET_URI = process.env.MONGO_URI;

if (!TARGET_URI) {
  console.error('[migrate] MONGO_URI is not set. Put your Atlas connection string in server/.env first.');
  process.exit(1);
}

const src = new MongoClient(SOURCE_URI, { serverSelectionTimeoutMS: 5000 });
const dst = new MongoClient(TARGET_URI, { serverSelectionTimeoutMS: 10000 });

try {
  await src.connect();
  await dst.connect();
  console.log('[migrate] connected to source and target');

  const collections = await src.db().listCollections().toArray();
  for (const { name } of collections) {
    const docs = await src.db().collection(name).find({}).toArray();
    if (docs.length === 0) {
      console.log(`[migrate] ${name}: empty, skipped`);
      continue;
    }
    await dst
      .db()
      .collection(name)
      .bulkWrite(docs.map((d) => ({ replaceOne: { filter: { _id: d._id }, replacement: d, upsert: true } })));
    console.log(`[migrate] ${name}: copied ${docs.length} document(s)`);
  }
  console.log('[migrate] done');
} finally {
  await src.close().catch(() => {});
  await dst.close().catch(() => {});
}
