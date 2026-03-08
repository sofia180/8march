const crypto = require("crypto");

module.exports = async (req, res) => {
  try {
    const botToken = process.env.TG_BOT_TOKEN;
    if (!botToken) {
      res.status(500).json({ ok: false, error: "TG_BOT_TOKEN missing" });
      return;
    }

    const initData = (req.body && req.body.initData) || (req.query && req.query.initData);
    if (!initData) {
      res.status(400).json({ ok: false, error: "initData required" });
      return;
    }

    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) {
      res.status(400).json({ ok: false, error: "hash missing" });
      return;
    }
    params.delete("hash");

    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");

    const secret = crypto.createHash("sha256").update(botToken).digest();
    const hmac = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");

    if (hmac !== hash) {
      res.status(401).json({ ok: false, error: "invalid signature" });
      return;
    }

    let user = null;
    try {
      const raw = params.get("user");
      if (raw) user = JSON.parse(raw);
    } catch (_) {
      user = null;
    }

    res.status(200).json({ ok: true, user });
  } catch (e) {
    console.error("tg-verify error", e);
    res.status(500).json({ ok: false, error: "internal error" });
  }
};
