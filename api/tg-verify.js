import crypto from "crypto";

export default async function handler(req, res) {
  const botToken = process.env.TG_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ ok: false, error: "TG_BOT_TOKEN missing" });
  }

  const initData = req.body?.initData || req.query?.initData;
  if (!initData) return res.status(400).json({ ok: false, error: "initData required" });

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return res.status(400).json({ ok: false, error: "hash missing" });
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secret = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");

  if (hmac !== hash) return res.status(401).json({ ok: false, error: "invalid signature" });

  let user = null;
  try {
    const raw = params.get("user");
    if (raw) user = JSON.parse(raw);
  } catch (e) {
    /* ignore */
  }

  return res.status(200).json({ ok: true, user });
}
