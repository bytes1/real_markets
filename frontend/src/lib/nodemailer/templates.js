export const PROFILE_UPDATE_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>Your Profile Has Been Updated</title>
    <style type="text/css">
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #141414 !important;
                border: 1px solid #30333A !important;
            }
            .dark-bg {
                background-color: #050505 !important;
            }
            .dark-text {
                color: #ffffff !important;
            }
            .dark-text-secondary {
                color: #9ca3af !important;
            }
            .dark-text-muted {
                color: #6b7280 !important;
            }
            .dark-border {
                border-color: #30333A !important;
            }
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
            }
            .mobile-padding {
                padding: 24px !important;
            }
            .mobile-header-padding {
                padding: 24px 24px 12px 24px !important;
            }
            .mobile-text {
                font-size: 14px !important;
                line-height: 1.5 !important;
            }
            .mobile-title {
                font-size: 24px !important;
                line-height: 1.3 !important;
            }
            .mobile-button a {
                width: calc(100% - 64px) !important;
                display: block !important;
                text-align: center !important;
            }
            .mobile-outer-padding {
                padding: 20px 10px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050505;">
        <tr>
            <td align="center" class="mobile-outer-padding" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">
                    
                    <tr>
                        <td align="left" class="mobile-header-padding" style="padding: 40px 40px 20px 40px;">
                            <h1 class="dark-text" style="font-size: 24px; font-weight: 600; margin: 0; color: #ffffff;">Your Platform</h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td class="mobile-padding" style="padding: 20px 40px 40px 40px;">
                            
                            <h2 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 22px; font-weight: 600; color: #d1d5db; line-height: 1.2;">
                                Your Profile Has Been Updated
                            </h2>
                            
                            {{intro}}
                            
                            <p class="mobile-text dark-text-secondary" style="margin: 30px 0 15px 0; font-size: 16px; line-height: 1.6; color: #9ca3af; font-weight: 600;">
                                What this means for you:
                            </p>
                            
                            <ul class="mobile-text dark-text-secondary" style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; line-height: 1.6; color: #9ca3af;">
                                <li style="margin-bottom: 12px;">You will now receive alerts and notifications at your new email address.</li>
                                <li style="margin-bottom: 12px;">Your alerts are configured for the markets you trade and the traders you follow.</li>
                            </ul>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 40px 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="{{appUrl}}/profile" style="display: block; width: 100%; background-color: #4a90e2; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; line-height: 1; text-align: center; box-sizing: border-box;">
                                            Go to Your Profile
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p class="mobile-text dark-text-muted" style="margin: 40px 0 0 0; font-size: 14px; line-height: 1.5; color: #6b7280 !important; text-align: center;">
                                If you did not make this change, please contact our support team immediately.<br>
                                <a href="{{appUrl}}" style="color: #6b7280 !important; text-decoration: underline;">Visit Your Dashboard</a><br>
                                © 2025 Your Company Name
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
