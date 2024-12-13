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
        name: "drivi-cars",
        script: "npm",
        args: "run start:store cars",
        env: {
          NODE_ENV: "production",
          PORT: 4322
        }
      }
    ]
};