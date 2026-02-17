import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  const connectionPaths = [
    { name: "Atlas Default", uri: process.env.MONGO_URI_ATLAS_DEFAULT, checkPrimary: false },
    { name: "Atlas SRV", uri: process.env.MONGO_URI_SRV, checkPrimary: false },
    { name: "Direct Shard 00", uri: process.env.SHARD_00, checkPrimary: true },
    { name: "Direct Shard 01", uri: process.env.SHARD_01, checkPrimary: true },
    { name: "Direct Shard 02", uri: process.env.SHARD_02, checkPrimary: true }
  ];

  for (const conn of connectionPaths) {
    if (!conn.uri) continue;

    try {
      console.log(`⏳ Testing: ${conn.name}...`);
      
      await mongoose.connect(conn.uri, { 
        serverSelectionTimeoutMS: 5000, 
        family: 4 
      });

      // Agar hum direct shard connect kar rahe hain, toh check karo Primary hai ya nahi
      if (conn.checkPrimary) {
        const isMasterDoc = await mongoose.connection.db.admin().command({ isMaster: 1 });
        
        if (!isMasterDoc.ismaster) {
          console.log(`ℹ️ ${conn.name} is Secondary (Read-Only). Skipping to next...`);
          await mongoose.disconnect();
          continue; 
        }
      }

      console.log(`✅ SUCCESS! Connected to PRIMARY via: ${conn.name}`);
      return; 
    } catch (err) {
      console.log(`❌ ${conn.name} failed: ${err.message}`);
    }
  }

  console.error("💥 SYSTEM FAILURE: No writable connection found!");
  process.exit(1);
};

export default connectDB;