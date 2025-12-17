import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Remove NEXT_PUBLIC_ prefix
  // Remove dangerouslyAllowBrowser - this should only run server-side
});

export { openai };