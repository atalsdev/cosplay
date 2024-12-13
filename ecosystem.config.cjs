module.exports = {
    apps: [
      {
        name: "bikes-store",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 4321,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "bikes-secret-123",
          STORE_ID: "bikes"
        },
        cwd: "./stores/bikes",
        namespace: "bikes",
        instances: 1,
        exec_mode: "fork"
      },
      {
        name: "digivast-store",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 4322,
          ENV_FILE: ".env",
          TEMP: "./tmp",
          TMPDIR: "./tmp",
          SESSION_SECRET: "digivast-secret-456",
          STORE_ID: "digivast"
        },
        cwd: "./stores/digivast",
        namespace: "digivast",
        instances: 1,
        exec_mode: "fork"
      }
    ]
};