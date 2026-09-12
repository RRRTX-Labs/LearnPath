export const enabledProviders = {
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  discord: Boolean(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET),
};
