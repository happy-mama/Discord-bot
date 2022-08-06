const config = require("./config.json");
const { ShardingManager } = require("discord.js");

const shard = new ShardingManager("./DClient.js", {
	token: config.discord["token_" + config.discord.use_token],
	autoSpawn: true,
	totalShards: 2,
	respawn: true
});
shard.on("shardCreate", shard => {
	console.log(`[SHARD]: creating... ${shard.id}`);
});

shard.spawn({
	amount: this.totalShards,
	delay: 1000,
	timeout: 30000
});