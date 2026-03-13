import type { VercelRequest, VercelResponse } from "@vercel/node";

// Resend API — same key as Part 1
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: "to, subject, and body are required" });
  }

  // Build HTML email
  const html = buildHtmlEmail(body, subject);

  if (!RESEND_API_KEY) {
    return res.status(200).json({
      id: `SIM-${Date.now()}`,
      status: "simulated",
      message: `Email simulated to ${to} (set RESEND_API_KEY env var to send real emails)`,
    });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PestxLawn <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
        text: body,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.message || "Resend API error" });
    }

    return res.status(200).json({
      id: data.id,
      status: "sent",
      message: `Email sent to ${to}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to send" });
  }
}

function buildHtmlEmail(body: string, subject: string): string {
  const lines = body.split("\n");
  const contentLines: string[] = [];
  let inMessage = false;

  for (const line of lines) {
    if (line.startsWith("Message: ")) {
      inMessage = true;
      contentLines.push(line.replace("Message: ", ""));
    } else if (inMessage) {
      contentLines.push(line);
    }
  }

  const messageHtml = (contentLines.length > 0 ? contentLines : lines)
    .map((l) => {
      if (l.startsWith("•")) return `<li style="margin:4px 0;color:#374151;">${l.slice(1).trim()}</li>`;
      if (l.trim() === "") return "<br/>";
      return `<p style="margin:6px 0;color:#374151;line-height:1.6;">${l}</p>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">PestxLawn</h1>
            <p style="margin:4px 0 0;color:#bbf7d0;font-size:13px;">Professional Pest Control & Lawn Care</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f0fdf4;padding:20px 40px;border-bottom:2px solid #16a34a;">
            <h2 style="margin:0;color:#15803d;font-size:18px;">${subject}</h2>
            <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            ${messageHtml}
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">PestxLawn &bull; Norman, OK 73069 &bull; (555) 123-4567</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
