import cron from 'node-cron';
import axios from 'axios';
import Post from '../model/postModel.js';

// --- 🛡️ Extensive Safe User-Agents List ---
const userAgents = [
  // Chrome (Windows & Mac)
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  // Firefox (Windows & Linux)
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:118.0) Gecko/20100101 Firefox/118.0',
  // Safari (Mac & iPhone)
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  // Edge (Windows)
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
  // Android (Chrome)
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const startLiveTracking = () => {
  // Har 2 ghante mein run hoga
  cron.schedule('*/1 * * * *', async () => {
    console.log(`--- 🛡️ Safe Tracking Started: ${new Date().toLocaleString()} ---`);

    try {
      const allPosts = await Post.find({ projectLink: { $ne: null } });
      if (allPosts.length === 0) {
        console.log("No links to check.");
        return;
      }

      // 1. Unique Links Filter (Taaki ek hi site par baar-baar hit na jaye)
      const uniqueLinks = [...new Set(allPosts.map(p => p.projectLink))];
      const results = {};

      console.log(`🔍 Checking ${uniqueLinks.length} unique links in safe mode...`);

      // 2. Small Batch Processing (Batch size 5)
      const batchSize = 5;
      for (let i = 0; i < uniqueLinks.length; i += batchSize) {
        const batch = uniqueLinks.slice(i, i + batchSize);

        await Promise.all(batch.map(async (link) => {
          const startTime = Date.now();
          // Randomly pick a User Agent from the list
          const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

          try {
            await axios.get(link, { 
              timeout: 15000, // 15s Patience
              headers: { 
                'User-Agent': randomUA,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache'
              } 
            });

            const duration = (Date.now() - startTime) / 1000;
            results[link] = false;
            console.log(`✅ [ALIVE] (${duration}s): ${link}`);
          } catch (err) {
            results[link] = true;
            console.log(`❌ [DEAD/SLOW]: ${link} | Error: ${err.message}`);
          }
        }));

        // 3. Short Gap (3 seconds) between batches to mimic human behavior
        if (i + batchSize < uniqueLinks.length) {
          console.log("⏳ Cooling down for 3 seconds...");
          await delay(5000); 
        }
      }

      // 4. Update Database for all posts (including duplicates)
      console.log("💾 Updating Database records...");
      const updatePromises = allPosts.map(post => {
        post.isLinkDead = results[post.projectLink];
        post.lastChecked = new Date(); 
        return post.save();
      });
      await Promise.all(updatePromises);

      console.log("--- ✅ All links updated safely without blocking ---");
    } catch (error) {
      console.error("Cron Job Error:", error.message);
    }
  });
};