export interface RedisServiceInterface {
    /**
     * Get Redis Client
     * @return {object}
     */
    createClient(): RedisClient<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts> & WithCommands & WithModules<RedisDefaultModules & RedisModules> & WithFunctions<RedisFunctions> & WithScripts<RedisScripts>;
}