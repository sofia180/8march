const crypto = require("crypto");

module.exports = async (req, res) => {
  try {
    const botToken = process.env.TG_BOT_TOKEN;
    const frontend = process.env.FRONTEND_ORIGIN || "https://8march.extender.cards";

    if (!botToken) {
      res.status(500).send("TG_BOT_TOKEN not configured");
      return;
    }

    const data = req.query || {};
    const hash = data.hash;
    if (!hash) {
      res.status(400).send("Missing hash");
      return;
    }

    const fields = Object.keys(data)
      .filter((k) => k !== "hash")
      .sort()
      .map((k) => `${k}=${data[k]}`)
      .join("\n");

    const secret = crypto.createHash("sha256").update(botToken).digest();
    const hmac = crypto.createHmac("sha256", secret).update(fields).digest("hex");

    if (hmac !== hash) {
      res.status(401).send("invalid signature");
      return;
    }

    let profile = null;
    try {
      profile = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        photo_url: data.photo_url,
      };
    } catch (_) {
      profile = null;
    }

    const encoded = encodeURIComponent(JSON.stringify(profile || {}));
    const redirect = `${frontend.replace(/\\/$/, "")}/create.html?tg=${encoded}`;
    res.writeHead(302, { Location: redirect });
    res.end();
  } catch (e) {
    console.error("telegram api error", e);
    res.status(500).send("internal error");
  }
};
