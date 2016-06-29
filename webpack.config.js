var bundler = require("nativescript-dev-webpack");

var config = bundler.getConfig({});
config.output.pathinfo = false;
module.exports = config;
