import crypto from "crypto";

/**
 * Telegram Login callback for WishDrop
 * Expects query params from Telegram widget and redirects back to create.html with verified profile.
 */
export default async function handler(req, res) {
  const data = req.query || {};
  const hash = data.hash;
  const botToken = process.env.TG_BOT_TOKEN;
  const frontend = process.env.FRONTEND_ORIGIN || "https://8march.extender.cards";

  if (!botToken) {
    return res.status(500).send("TG_BOT_TOKEN not configured");
  }

  if (!hash) {
    return res.status(400).send("Missing hash");
  }

  // Build data-check-string
  const fields = Object.keys(data)
    .filter((k) => k !== "hash")
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join("\n");

  const secret = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto.createHmac("sha256", secret).update(fields).digest("hex");

  if (hmac !== hash) {
    return res.status(401).send("invalid signature");
  }

  const profile = {
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    username: data.username,
    photo_url: data.photo_url,
  };

  const encoded = encodeURIComponent(JSON.stringify(profile));
  const redirect = `${frontend.replace(/\\/$/, "")}/create.html?tg=${encoded}`;
  res.setHeader("Location", redirect);
  res.statusCode = 302;
  res.end();
}
