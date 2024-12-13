module.exports = {
    apps: [
      {
        name: "bikes-store",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 4321,
          ENV_FILE: ".env"
        },
        cwd: "./stores/bikes"
      },
      {
        name: "digivast-store",
        script: "node",
        args: "-r dotenv/config ./dist/server/entry.mjs",
        env: {
          NODE_ENV: "production",
          PORT: 4322,
          ENV_FILE: ".env"
        },
        cwd: "./stores/digivast"
      }
    ]
};