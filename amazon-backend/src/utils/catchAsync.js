/**
 * Wrapper for async functions to catch errors
 * Eliminates need for try-catch in every controller
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
