# task-rate-limiting-api
This Node.js API enforces user-based rate limiting and task queueing, allowing 1 task per second and 20 tasks per minute. Exceeding requests are queued with Redis, and Bottleneck manages rate limits. Task completions are logged, and Node.js clustering ensures scalability and fault tolerance.

# Features:
User-Based Rate Limiting: Each user is limited to one task per second and 20 tasks per minute using the Bottleneck library.
Task Queueing: Tasks that exceed the rate limit are queued and processed later using Redis as the queue manager.
Task Logging: Task completions are logged to a file (task_logs.txt) with user ID, task ID, and timestamps.
Clustering: The app uses Node.js clustering to scale across multiple CPU cores, making it more resilient and scalable.

# Technologies Used:
Node.js: JavaScript runtime for backend development.
Express.js: Web framework to handle REST API requests.
Redis: Used for task queueing and management.
Bottleneck: A rate-limiting library.
Clustering: Node.js feature for better performance across multiple CPU cores.

