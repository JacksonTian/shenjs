var build = function (str, filename) {
  try {
    var fn = new Function('locals, filters, escape, rethrow', str);
  } catch (err) {
    if ('SyntaxError' == err.name) {
      err.message += filename
        ? ' in ' + filename
        : ' while compiling ejs';
    }
    throw err;
  }
  return fn;
};
