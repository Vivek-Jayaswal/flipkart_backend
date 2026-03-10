const createMessage = (to, from, body) => {
  return {
    to,
    from,
    body,
  };
}
module.exports = { createMessage };