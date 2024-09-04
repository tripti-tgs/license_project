const { ClickHouseClient, createClient } = require('@clickhouse/client');
require('dotenv').config();

module.exports = {
  initClickHouseClient: async (config = {}) => {
    const {
      username = process.env.CLICKHOUSE_USERNAME,
      password = process.env.CLICKHOUSE_PASSWORD,
      host = process.env.CLICKHOUSE_HOST,
      port = process.env.CLICKHOUSE_PORT,
      database = process.env.CLICKHOUSE_DATABASE,
    } = config;

    const client = createClient({
      url: `http://${username}:${password}@${host}:${port}/${database}`,
    });

    if (!(await client.ping())) {
      throw new Error('failed to ping ClickHouse!');
    }
    return client;
  },
};

