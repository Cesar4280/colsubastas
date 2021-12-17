exports.expiration = 1800; // expira en 30min (media hora)
exports.getISOFormat = () => new Date().toISOString();
exports.generateRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);