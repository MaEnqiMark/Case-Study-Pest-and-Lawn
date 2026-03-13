import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// CORS headers so Part 2 (employee dashboard) can call this endpoint
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// In-memory log of sent emails (for demo tracking)
const emailLog: {
  id: string;
  to: string;
  subject: string;
  sentAt: string;
  status: "sent" | "simulated";
}[] = [];

function buildHtmlEmail(body: string, subject: string): string {
  // Parse the plain text body to extract fields
  const lines = body.split("\n");
  const fields: { label: string; value: string }[] = [];
  let preamble = "";

  for (const line of lines) {
    const match = line.match(/^(Name|Email|Phone|Service|Message):\s*(.*)$/);
    if (match) {
      fields.push({ label: match[1], value: match[2] });
    } else if (line.trim() && !fields.length) {
      preamble = line.trim();
    }
  }

  const fieldRows = fields
    .map(
      (f) => `
      <tr>
        <td style="padding: 12px 16px; font-weight: 600; color: #374151; background: #f9fafb; border-bottom: 1px solid #e5e7eb; width: 120px; vertical-align: top;">
          ${f.label}
        </td>
        <td style="padding: 12px 16px; color: #111827; border-bottom: 1px solid #e5e7eb;">
          ${f.value || '<span style="color: #9ca3af;">Not provided</span>'}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                PestxLawn
              </h1>
              <p style="margin: 4px 0 0; color: #bbf7d0; font-size: 13px;">
                Professional Pest Control & Lawn Care
              </p>
            </td>
          </tr>

          <!-- Subject Banner -->
          <tr>
            <td style="background: #f0fdf4; padding: 20px 40px; border-bottom: 2px solid #16a34a;">
              <h2 style="margin: 0; color: #15803d; font-size: 18px; font-weight: 600;">
                ${subject}
              </h2>
              <p style="margin: 6px 0 0; color: #6b7280; font-size: 13px;">
                ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">
              ${preamble ? `<p style="margin: 0 0 20px; color: #374151; font-size: 15px; line-height: 1.6;">${preamble}</p>` : ""}

              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                ${fieldRows}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0 0 12px; color: #374151; font-size: 14px;">
                      Respond to this lead within 24 hours for the best conversion rate.
                    </p>
                    <p style="margin: 0; color: #6b7280; font-size: 13px;">
                      This inquiry was submitted through the PestxLawn website contact form.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                PestxLawn &bull; Norman, OK 73069 &bull; Est. 1959
              </p>
              <p style="margin: 4px 0 0; color: #9ca3af; font-size: 11px;">
                This is an automated notification from your website lead capture system.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  const { to, subject, body } = await request.json();

  if (!to || !subject || !body) {
    return NextResponse.json(
      { error: "to, subject, and body are required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const emailId = `E${Date.now()}`;
  const html = buildHtmlEmail(body, subject);

  // If Resend is configured, send a real email
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: "PestxLawn <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
        text: body,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
      }

      emailLog.push({
        id: emailId,
        to,
        subject,
        sentAt: new Date().toISOString(),
        status: "sent",
      });

      return NextResponse.json({
        id: emailId,
        resendId: data?.id,
        status: "sent",
        message: `Email sent to ${to}`,
      }, { headers: corsHeaders });
    } catch (err) {
      return NextResponse.json(
        { error: `Failed to send: ${err}` },
        { status: 500, headers: corsHeaders }
      );
    }
  }

  // No API key — simulate the send
  emailLog.push({
    id: emailId,
    to,
    subject,
    sentAt: new Date().toISOString(),
    status: "simulated",
  });

  return NextResponse.json({
    id: emailId,
    status: "simulated",
    message: `Email simulated to ${to} (set RESEND_API_KEY to send real emails)`,
    preview: { to, subject, body },
  }, { headers: corsHeaders });
}

// GET: view email send log
export async function GET() {
  return NextResponse.json({
    totalSent: emailLog.length,
    emails: emailLog,
  }, { headers: corsHeaders });
}
