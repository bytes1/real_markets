import { inngest } from "./client.js";
import { PROFILE_UPDATE_PROMPT } from "./prompts.js";
import { sendUpdateEmail } from "../nodemailer/index.js";
export const sendEmailUpdated = inngest.createFunction(
  { id: "send-email-updated" },
  { event: "app/email-updated" },

  async ({ event, step }) => {
    const userProfile = `
    -email:${event.data.email}
    -username:${event.data.username}
    -emailPreferences:${event.data.emailPreferences}
    -walletAddress:${event.data.walletAddress}
    `;
    const prompt = PROFILE_UPDATE_PROMPT.replace(
      "{{userProfile}}",
      userProfile
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-email-updated", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && "text" in part ? part.text : null) ||
        "Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.";

      const {
        data: { email },
      } = event;

      return await sendUpdateEmail({ email, intro: introText });
    });

    return {
      success: true,
      message: "email updated sent successfully",
    };
  }
);
