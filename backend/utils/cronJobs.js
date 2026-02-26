import cron from 'node-cron';
import axios from 'axios';
import Post from '../model/postModel.js'; // Tumhara Post model

export const startLiveTracking = () => {
  
  cron.schedule('0 * * * *', async () => {
    console.log("--- 🟢 Live Tracking: Checking Project Links ---");
    
    try {
     
      const posts = await Post.find({ projectLink: { $ne: null } });

      for (let post of posts) {
        try {
         
          const res = await axios.head(post.projectLink, { timeout: 5000 });
          post.isLinkDead = (res.status >= 400); 
        } catch (err) {
         
          post.isLinkDead = true;
        }
        await post.save();
      }
      console.log("--- ✅ Tracking Complete: All links updated ---");
    } catch (error) {
      console.error("Cron Job Error:", error.message);
    }
  });
};