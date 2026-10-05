import { initialize } from "unleash-client";

export const unleash = initialize({
  url: process.env.UNLEASH_URL,
  appName: process.env.UNLEASH_APP_NAME,
  customHeaders: {
    Authorization: process.env.UNLEASH_API_TOKEN,
  },
});
