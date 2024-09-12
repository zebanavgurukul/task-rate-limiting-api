require('dotenv').config();
const express = require('express');
const Bottleneck = require('bottleneck');
const fs = require('fs');
const { createClient } = require('redis');

// Create Redis client (Redis v4+)
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.connect().catch(console.error);

// Handle Redis errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Setup Express
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Store limiters per user
const limiters = {};

// Function to get or create a limiter for a user
const getUserLimiter = (userId) => {
  if (!limiters[userId]) {
    limiters[userId] = new Bottleneck({
      minTime: 1000, // 1 task per second
      reservoir: 20, // 20 tasks per minute
      reservoirRefreshAmount: 20,
      reservoirRefreshInterval: 60 * 1000, // Reset every minute
    });
  }
  return limiters[userId];
};

// Function to log task completion
const logTask = (userId, taskId) => {
  const timestamp = new Date().toISOString();
  const log = `User: ${userId}, Task: ${taskId}, Timestamp: ${timestamp}\n`;
  fs.appendFile('task_logs.txt', log, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
};
    

// Function to process the task
const processTask = (userId, taskId) => {
  logTask(userId, taskId);
  console.log(`Processed task for user ${userId}, task: ${taskId}`);
};

// Handle rate limiting and task queue
const handleTask = async (req, res) => {
  const { userId, taskId } = req.body;

  if (!userId || !taskId) {
    return res.status(400).json({ message: 'userId and taskId are required.' });
  }

  // Use Redis to store the queue state for the user
  const queueKey = `user_queue:${userId}`;

  try {
    // Add the task to the user's queue (Redis v4+: use lPush)
    await redisClient.lPush(queueKey, JSON.stringify({ taskId }));

    // Get the user's limiter
    const limiter = getUserLimiter(userId);

    // Schedule the task processing according to the rate limit
    limiter.schedule(async () => {
      // Process the next task in the queue (Redis v4+: use rPop)
      const taskData = await redisClient.rPop(queueKey);
      if (taskData) {
        const { taskId } = JSON.parse(taskData);
        processTask(userId, taskId);
      }
    });

    res.json({ message: 'Task added to the queue.' });
  } catch (error) {
    console.error('Error handling task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Route
app.post('/api/v1/task', handleTask);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
