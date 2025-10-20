// api/inngest.ts
import { serve } from "inngest/express";
import { inngest } from "../src/lib/inngest/client.js"; // Add .js extension
import { sendEmailUpdated } from "../src/lib/inngest/functions.js"; // Add .js extension

export default serve({
  client: inngest,
  functions: [sendEmailUpdated],
});
