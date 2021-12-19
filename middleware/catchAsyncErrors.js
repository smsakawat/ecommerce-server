module.exports = (callBack) => (req, res, next) => {
  Promise.resolve(callBack(req, res, next)).catch(next);
};
