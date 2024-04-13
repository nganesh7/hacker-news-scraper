// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to Hacker News...');
    // Navigate to Hacker News
    await page.goto('https://news.ycombinator.com/');
    console.log('Waiting for posts to load...');
  
    // Wait for posts to load
    await page.waitForSelector('.athing');
    console.log('Posts loaded, extracting data...');

    // Extract top posts
    const topPosts = await page.evaluate(() => {
      const posts = [];
      const postElements = document.querySelectorAll('.athing');
      // Iterate through post elements
      for (let i = 0; i < Math.min(postElements.length, 10); i++) {
        const postElement = postElements[i];
        // Extract title and link
        const titleElement = postElement.querySelector('.title a');
        const scoreElement = postElement.nextElementSibling.querySelector('.score');
        // Check if title and score elements exist
        if (titleElement && scoreElement) {
          const title = titleElement.innerText;
          const link = titleElement.getAttribute('href');
          const score = scoreElement.innerText;
          posts.push({ serial: i + 1, title, link, score });
        } else {
          console.error(`Could not find title or score for post ${i + 1}`);
        }
      }
      return posts;
    });
    
    console.log('Top Posts on Hacker News:');
    // Log top posts
    topPosts.forEach((post) => {
      console.log(`${post.serial}. ${post.title} - ${post.score}\n   Link: ${post.link}`);
    });

    // Save to CSV
    const csvContent = topPosts.map(post => `${post.serial},${post.title},${post.link},${post.score}`).join('\n');
    fs.writeFileSync('hacker_news_top_10.csv', csvContent);

    console.log('Top 10 posts saved to hacker_news_top_10.csv');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    console.log('Closing browser...');
    // Close browser
    await browser.close();
  }
})();