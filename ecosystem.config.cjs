module.exports = {
    apps: [
      {
        name: "drivi-bikes",
        script: "npm",
        args: "run start:store bikes",
        env: {
          NODE_ENV: "production",
          PORT: 4321
        }
      },
      {
        name: "digivast",
        script: "npm",
        args: "run start:store digivast",
        env: {
          NODE_ENV: "production",
          PORT: 4322
        }
      }
    ]
};