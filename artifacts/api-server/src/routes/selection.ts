import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";
import { db, submissionsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

const DEST_EMAIL = "LHarrington@nuhomeonline.com";

function buildTransporter() {
  return nodemailer.createTransport({
    host: process.env["SMTP_HOST"],
    port: Number(process.env["SMTP_PORT"] ?? 587),
    secure: false,
    auth: {
      user: process.env["SMTP_USER"],
      pass: process.env["SMTP_PASS"],
    },
  });
}

function buildEmailHtml(data: {
  name: string;
  property: string;
  claim: string;
  product: string;
  color: string;
  notes: string;
}) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 14px;font-weight:600;color:#6B6B6B;font-size:13px;white-space:nowrap;background:#F7F8F5;border-bottom:1px solid #E8EDE4;">${label}</td>
      <td style="padding:10px 14px;color:#2A2A2A;font-size:14px;border-bottom:1px solid #E8EDE4;">${value || "—"}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F7F8F5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #D4E8C2;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <div style="background:#6DB33F;padding:20px 28px;">
      <div style="color:#fff;font-size:20px;font-weight:700;">NuHome Exteriors</div>
      <div style="color:rgba(255,255,255,0.85);font-size:13px;margin-top:4px;">New Siding Selection Submitted</div>
    </div>
    <div style="padding:24px 28px 8px;">
      <p style="margin:0 0 16px;font-size:14px;color:#3D3D3D;">A client has submitted their siding selection. Details below:</p>
      <table style="width:100%;border-collapse:collapse;border-radius:6px;overflow:hidden;border:1px solid #E8EDE4;">
        ${row("Client Name", data.name)}
        ${row("Property", data.property)}
        ${row("Claim #", data.claim)}
        ${row("Selected Product", data.product)}
        ${row("Selected Color", data.color)}
        ${row("Notes", data.notes)}
      </table>
    </div>
    <div style="padding:20px 28px 28px;">
      <p style="margin:0;font-size:12px;color:#9B9B9B;">Sent automatically from the NuHome Siding Selection Portal.</p>
    </div>
  </div>
</body>
</html>`;
}

router.post("/submit-selection", async (req, res) => {
  const { name, property, claim, product, color, notes } = req.body as {
    name: string;
    property: string;
    claim: string;
    product: string;
    color: string;
    notes: string;
  };

  if (!name || !property || !claim || !product || !color) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // Save to DB — non-blocking: log failure but continue to send email
  try {
    await db.insert(submissionsTable).values({ name, property, claim, product, color, notes: notes ?? "" });
  } catch (dbErr) {
    req.log.error({ err: dbErr }, "Failed to save submission to DB — continuing to send email");
  }

  try {
    const transporter = buildTransporter();
    await transporter.sendMail({
      from: `"NuHome Portal" <${process.env["SMTP_FROM"]}>`,
      to: DEST_EMAIL,
      subject: `New Siding Selection — ${name} | Claim #${claim}`,
      html: buildEmailHtml({ name, property, claim, product, color, notes }),
    });
  } catch (mailErr) {
    req.log.error({ err: mailErr }, "Failed to send notification email");
    res.status(500).json({ error: "Submission saved but email failed to send" });
    return;
  }

  res.json({ ok: true });
});

router.get("/submissions", async (req, res) => {
  const dashboardPassword = process.env["DASHBOARD_PASSWORD"];
  if (!dashboardPassword) {
    req.log.error("DASHBOARD_PASSWORD environment variable is not set");
    res.status(503).json({ error: "Dashboard not configured" });
    return;
  }

  const auth = req.headers["x-dashboard-password"];
  if (auth !== dashboardPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const rows = await db.select().from(submissionsTable).orderBy(desc(submissionsTable.submittedAt));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch submissions");
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;
