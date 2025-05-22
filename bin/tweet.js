#!/usr/bin/env node

const { program } = require('commander');
const twitterClient = require('../lib/auth');

program
  .version('0.0.1')
  .description('A CLI tool to send tweets from your terminal (JavaScript Edition)')
  .argument('<message>', 'the tweet message to send')
  .action(async (message) => {
    try {
      // Validate tweet length (Twitter's limit is 280 characters)
      if (message.length > 280) {
        console.error('Error: Tweet exceeds 280 characters.');
        process.exit(1);
      }

      // Verify authentication
      const user = await twitterClient.v2.me();
      console.log(`Authenticated as @${user.data.username}`);

      // Send the tweet using v2 API
      const tweet = await twitterClient.v2.tweet(message);
      console.log('Tweet sent successfully!');
      console.log(`https://twitter.com/${user.data.username}/status/${tweet.data.id}`);
    } catch (error) {
      console.error('Error:', error.message || error);
      if (error.data) {
        console.error('API Error Details:', error.data);
      }
      process.exit(1);
    }
  });

program.showHelpAfterError('(add --help for additional information)');

program.parse(process.argv);
