// employee-service/utils/redisClient.ts
import { createClient } from "redis";

const redisClient = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`}); // redis is docker service name
redisClient.connect();

export default redisClient;
