const path = require('path');
module.exports = {
  mode:'production',
  entry: './www/index.js',
  output: {
    filename: 'app.bundle.js',
    path: path.join(__dirname,'www/dist/')
  },
};
