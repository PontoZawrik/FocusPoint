module.exports = {
  jwtSecret: process.env.JWT_SECRET || "quack-qwerty", // Секрет в каком-то смысле для access-токена. По умолчанию берём из .env
  jwtExpiresIn: "5h", // Например, 1 час. Можно '1d', '7d' и т.д.
};
