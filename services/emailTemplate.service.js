import dotenv from "dotenv";
dotenv.config();

const generateInvoiceTemplate = (
  packageName,
  customerName = "Customer",
  amount = 0,
  paymentStatus,
  date
) => {
  const amt = Number(amount) || 0;
  const formattedAmount = amt.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const displayAmount = `$${formattedAmount}`;

  const dt = date && date instanceof Date ? date : new Date(date || Date.now());
  const displayDate = dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const statusKey = String(paymentStatus).toLowerCase();
  let badgeColor = "#6c757d"; // gray default
  let badgeText = String(paymentStatus);

  if (["paid", "success", "completed"].includes(statusKey)) {
    badgeColor = "#28a745";
    badgeText = "Paid";
  } else if (["pending", "processing", "awaiting"].includes(statusKey)) {
    badgeColor = "#ffc107";
    badgeText = "Pending";
  } else if (
    ["failed", "canceled", "cancelled", "chargedback"].includes(statusKey)
  ) {
    badgeColor = "#dc3545";
    badgeText = "Failed";
  } else {
    badgeText = badgeText.charAt(0).toUpperCase() + badgeText.slice(1);
  }

  const companyName = process.env.COMPANY_NAME || "Tech Solutions";
  const supportEmail =
    process.env.SUPPORT_EMAIL || "support@techsolutions.site";
  const copyrightYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Invoice</title>
        <style>
                @media only screen and (max-width: 600px) {
                        .email-container { width: 100% !important; max-width: 100% !important; }
                        .mobile-padding { padding: 20px !important; }
                        .mobile-header { padding: 30px 20px 20px !important; }
                        .mobile-text { font-size: 14px !important; }
                        .mobile-title { font-size: 24px !important; }
                        .mobile-total { font-size: 28px !important; }
                        .mobile-stack { display: block !important; width: 100% !important; text-align: left !important; }
                        .mobile-stack-right { text-align: left !important; padding-top: 10px !important; }
                }
        </style>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f4f4f4;">
        <tr>
            <td style="padding:40px 20px;">
                <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600" style="margin:0 auto;background-color:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);max-width:600px;">
                    <tr>
                        <td class="mobile-header" style="background:linear-gradient(135deg,#cd1a40 0%,#ff803c 100%);padding:40px 40px 30px;text-align:center;border-radius:8px 8px 0 0;">
                            <h1 class="mobile-title" style="margin:0;color:#ffffff;font-size:32px;font-weight:bold;">INVOICE</h1>
                            <p style="margin:10px 0 0;color:#ffffff;font-size:14px;opacity:0.9;">Thank you for your business</p>
                        </td>
                    </tr>

                    <tr>
                        <td class="mobile-padding" style="padding:40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:30px;">
                                <tr>
                                    <td class="mobile-stack" style="vertical-align:top;">
                                        <p style="margin:0 0 5px;color:#666666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Bill To</p>
                                        <h2 style="margin:0;color:#000000;font-size:20px;font-weight:bold;">${escapeHtml(
                                          customerName
                                        )}</h2>
                                    </td>
                                    <td class="mobile-stack mobile-stack-right" style="text-align:right;vertical-align:top;">
                                        <p style="margin:0 0 5px;color:#666666;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Invoice Date</p>
                                        <p style="margin:0;color:#000000;font-size:16px;font-weight:600;">${escapeHtml(
                                          displayDate
                                        )}</p>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse:collapse;margin-bottom:30px;">
                                <tr>
                                    <td colspan="2" style="padding:15px;background-color:#cd1a40;border-radius:4px 4px 0 0;">
                                        <p style="margin:0;color:#ffffff;font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Invoice Details</p>
                                    </td>
                                </tr>
                                <tr style="background-color:#f9f9f9;">
                                    <td style="padding:15px;border-bottom:1px solid #eeeeee;width:50%;">
                                        <p style="margin:0;color:#666666;font-size:13px;">Package Name</p>
                                    </td>
                                    <td style="padding:15px;text-align:right;border-bottom:1px solid #eeeeee;width:50%;">
                                        <p class="mobile-text" style="margin:0;color:#000000;font-size:14px;font-weight:600;">${escapeHtml(
                                          packageName
                                        )}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:15px;border-bottom:1px solid #eeeeee;">
                                        <p style="margin:0;color:#666666;font-size:13px;">Amount</p>
                                    </td>
                                    <td style="padding:15px;text-align:right;border-bottom:1px solid #eeeeee;">
                                        <p class="mobile-text" style="margin:0;color:#000000;font-size:14px;font-weight:600;">${escapeHtml(
                                          displayAmount
                                        )}</p>
                                    </td>
                                </tr>
                                <tr style="background-color:#f9f9f9;">
                                    <td style="padding:15px;border-radius:0 0 0 4px;">
                                        <p style="margin:0;color:#666666;font-size:13px;">Payment Status</p>
                                    </td>
                                    <td style="padding:15px;text-align:right;border-radius:0 0 4px 0;">
                                        <span style="display:inline-block;padding:6px 16px;background-color:${badgeColor};color:#ffffff;font-size:12px;font-weight:bold;border-radius:20px;text-transform:uppercase;">${escapeHtml(
    badgeText
  )}</span>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:30px;">
                                <tr>
                                    <td style="padding:20px;background:linear-gradient(135deg,#cd1a40 0%,#ff803c 100%);border-radius:4px;text-align:center;">
                                        <p style="margin:0 0 5px;color:#ffffff;font-size:14px;opacity:0.9;">Total Amount</p>
                                        <p class="mobile-total" style="margin:0;color:#ffffff;font-size:32px;font-weight:bold;">${escapeHtml(
                                          displayAmount
                                        )}</p>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding:20px;background-color:#f9f9f9;border-radius:4px;text-align:center;">
                                        <p style="margin:0;color:#666666;font-size:14px;line-height:1.6;">If you have any questions about this invoice, please contact us at <a href="mailto:${escapeHtml(
                                          supportEmail
                                        )}" style="color:#cd1a40;text-decoration:none;font-weight:600;">${escapeHtml(
    supportEmail
  )}</a></p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <tr>
                        <td style="padding:30px 40px;text-align:center;background-color:#f9f9f9;border-radius:0 0 8px 8px;">
                            <p style="margin:0 0 10px;color:#000000;font-size:16px;font-weight:bold;">${escapeHtml(
                              companyName
                            )}</p>
                            <p style="margin:0;color:#666666;font-size:12px;">© ${escapeHtml(
                              String(copyrightYear)
                            )} ${escapeHtml(
    companyName
  )}. All rights reserved.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

const generateTempPasswordTemplate = (
  customerName = "Customer",
  tempCode = "",
  expiryMinutes = 15
) => {
  const companyName = process.env.COMPANY_NAME || "Tech Solutions";
  const supportEmail =
    process.env.SUPPORT_EMAIL || "support@techsolutions.site";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .mobile-padding {
                padding: 20px !important;
            }
            .mobile-header {
                padding: 30px 20px !important;
            }
            .mobile-title {
                font-size: 24px !important;
            }
            .reset-code {
                font-size: 32px !important;
                padding: 20px 15px !important;
                letter-spacing: 8px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 600px;">
                    
                    <!-- Header -->
                    <tr>
                        <td class="mobile-header" style="background: linear-gradient(135deg, #cd1a40 0%, #ff803c 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 class="mobile-title" style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Password Reset Request</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 40px;">
                            
                            <!-- Greeting -->
                            <p style="margin: 0 0 20px; color: #000000; font-size: 16px; line-height: 1.6;">Hello <strong>${escapeHtml(
                              customerName
                            )}</strong>,</p>
                            
                            <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">
                                We received a request to reset your password. Use the verification code below to complete your password reset:
                            </p>
                            
                            <!-- Reset Code Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="text-align: center; padding: 30px; background: linear-gradient(135deg, #cd1a40 0%, #ff803c 100%); border-radius: 8px;">
                                        <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Your Reset Code</p>
                                        <p class="reset-code" style="margin: 0; color: #ffffff; font-size: 42px; font-weight: bold; letter-spacing: 12px; font-family: 'Courier New', monospace;">${escapeHtml(
                                          tempCode
                                        )}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Expiration Notice -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px; background-color: #fff8e6; border-left: 4px solid #ff803c; border-radius: 4px;">
                                        <p style="margin: 0; color: #000000; font-size: 14px; line-height: 1.6;">
                                            ⏰ <strong>This code will expire in ${escapeHtml(
                                              String(expiryMinutes)
                                            )} minutes</strong> for security reasons.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Instructions -->
                            <p style="margin: 0 0 20px; color: #666666; font-size: 15px; line-height: 1.6;">
                                Enter this code on the password reset page to create a new password for your account.
                            </p>
                            
                            <!-- Security Notice -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px; background-color: #f9f9f9; border-radius: 4px;">
                                        <p style="margin: 0 0 10px; color: #cd1a40; font-size: 14px; font-weight: bold;">🔒 Didn't request this?</p>
                                        <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                            If you didn't request a password reset, please ignore this email or contact our support team immediately. Your password will remain unchanged.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Support -->
                            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6; text-align: center;">
                                Need help? Contact us at <a href="mailto:${escapeHtml(
                                  supportEmail
                                )}" style="color: #cd1a40; text-decoration: none; font-weight: 600;">${escapeHtml(
    supportEmail
  )}</a>
                            </p>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; text-align: center; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0 0 10px; color: #000000; font-size: 16px; font-weight: bold;">${escapeHtml(
                              companyName
                            )}</p>
                            <p style="margin: 0 0 15px; color: #666666; font-size: 12px;">© ${escapeHtml(
                              String(year)
                            )} ${escapeHtml(
    companyName
  )}. All rights reserved.</p>
                            <p style="margin: 0; color: #999999; font-size: 11px;">
                                This is an automated message, please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

// minimal HTML escaping to avoid breaking template if inputs contain markup
const escapeHtml = (str) =>
  String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export default {
  generateInvoiceTemplate,
  generateTempPasswordTemplate,
};
