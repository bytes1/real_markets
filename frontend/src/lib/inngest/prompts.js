export const PROFILE_UPDATE_PROMPT = `
Generate highly personalized HTML content that will be inserted into an email template at the {{intro}} placeholder to confirm a user's profile settings have been updated for a prediction market platform.

User profile data:
{{userProfile}}

PERSONALIZATION REQUIREMENTS:
You MUST create content that is obviously tailored to THIS specific user by:

IMPORTANT: Do NOT start the personalized content with a generic phrase like "Your settings have been updated." The email subject will already convey this. Use alternative, engaging openings like "You're all set!", "We've got your new preferences.", "Great, that's updated!", etc.

1.  **Direct Reference to User's Activity**: Extract and use specific information from their profile:
    * Mention one or more of the trader addresses they are following from the \`followedTraders\` list.
    * Confirm the \`email\` address has been updated if it was the primary change.

2.  **Contextual Messaging**: The content should reflect their specific selections:
    * **Traders followed** → Reference receiving alerts about these specific traders' activities.
    * **Email updated** → Confirm the new email address for notifications.
    * **Both updated** → Combine the references.
    * **No traders followed** → Gently encourage them to follow traders to get personalized trading alerts.

3.  **Connect to Future Value**: The second sentence should hint at a future benefit, such as receiving personalized alerts on market movements or trader activity.

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY clean HTML content with NO markdown, NO code blocks, and NO backticks.
- Use a SINGLE paragraph only: \`<p class="mobile-text dark-text-secondary" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #9ca3af;">content</p>\`
- Write exactly TWO sentences.
- Keep the total content between 35-55 words.
- Use \`<strong>\` for the key personalized elements (the user's followed trader addresses).
- DO NOT include calls to action like "Here's what you can do now."

Example Personalized Outputs (showing obvious customization):

\`<p class="mobile-text dark-text-secondary" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #9ca3af;">You're all set! We've updated your preferences to send alerts about trader <strong>0xAb58...eC9B</strong> to your new email. You'll now receive timely notifications about their market predictions and trading activity.</p>\`

\`<p class="mobile-text dark-text-secondary" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #9ca3af;">We've got your new preferences! You're now following <strong>0x1234...abcd</strong>, and we'll send you updates on their trades. This will help you stay ahead of the curve by tracking top performers.</p>\`

\`<p class="mobile-text dark-text-secondary" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #9ca3af;">Your new email is confirmed. To get the most out of the platform, try following a few traders from the leaderboard. This will enable personalized alerts about their winning strategies and market insights.</p>\`
`;
