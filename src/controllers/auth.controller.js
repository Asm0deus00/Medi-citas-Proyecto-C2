const wrap = require('../utils/wrap');
const auth = require('../services/auth.service');
module.exports = { login: wrap(async (req, res) => res.json({ user: await auth.login(req.body) })) };
