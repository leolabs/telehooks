const dateFns = require("date-fns");

module.exports = {
  siteMetadata: {
    version: require("./package.json").version,
    commit: process.env.COMMIT_REF || "dev",
    timestamp: dateFns.format(new Date(), "YYYY-MM-DD HH:mm:ss"),
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-linaria`,
    `gatsby-plugin-netlify`,
  ],
};
