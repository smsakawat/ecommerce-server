module.exports = (callBack) => (req, res, next) => {
  Promise.resolve(callBack(req, res, next)).catch(next);
};
// I should understand Higher order compoenent or Higher functions more to understand this
