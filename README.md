# task-rate-limiting-api
This Node.js API enforces user-based rate limiting and task queueing, allowing 1 task per second and 20 tasks per minute. Exceeding requests are queued with Redis, and Bottleneck manages rate limits. Task completions are logged, and Node.js clustering ensures scalability and fault tolerance.

## Features:
- **User-Based Rate Limiting**: Each user is limited to one task per second and 20 tasks per minute using the Bottleneck library.
- **Task Queueing**: Tasks that exceed the rate limit are queued and processed later using Redis as the queue manager.
- **Task Logging**: Task completions are logged to a file (task_logs.txt) with user ID, task ID, and timestamps.
- **Clustering**: The app uses Node.js clustering to scale across multiple CPU cores, making it more resilient and scalable.

## Technologies Used:
- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Framework for handling HTTP requests.
- **Redis**: Stores user task queues.
- **Bottleneck**: Manages rate-limiting functionality.
- **Node.js Clustering**: Enables scalability by leveraging multi-core processing.

## Getting Started
# Prerequisites
- **Node.js**: Ensure you have Node.js installed.
- **Redis**: Install Redis and have it running.

# Configuration
Create a .env file in the project root with the following variables:
- **REDIS_HOST**=*********
- **REDIS_PORT**=****
- **PORT**=****
Ensure Redis is installed and running on the specified host and port.

## Usage
# Submit a Task
To submit a task for a specific user, send a POST request to /api/v1/task.
- **Endpoint**: /api/v1/task
- **Method**: POST
- **Request Body**: 
{
  "userId": "user1",
  "taskId": "task123"
}
- **Response**: 
{
  "message": "Task added to the queue."
}

## Task Logs
Task completions are logged in the task_logs.txt file in the following format:
User: user1, Task: task123, Timestamp: 2024-09-11T17:55:59.766Z
