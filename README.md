# task-rate-limiting-api
This Node.js API enforces user-based rate limiting and task queueing, allowing 1 task per second and 20 tasks per minute. Exceeding requests are queued with Redis, and Bottleneck manages rate limits. Task completions are logged, and Node.js clustering ensures scalability and fault tolerance.
