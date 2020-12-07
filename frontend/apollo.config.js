module.exports = {
    client: {
      service: {
        name: 'sprintMaster',
        // URL to the GraphQL API
        url: 'http://localhost:4002/graphql',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }