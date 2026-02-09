const axios = require('axios');
const cheerio = require('cheerio');

const fetchWebpageTitle = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const title = $('title').text().trim() || 
                  $('meta[property="og:title"]').attr('content') || 
                  $('meta[name="twitter:title"]').attr('content') || 
                  url;

    return title;
  } catch (error) {
    console.error('Error fetching title:', error.message);
    return url;
  }
};

module.exports = { fetchWebpageTitle };
