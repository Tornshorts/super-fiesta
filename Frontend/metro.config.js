// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix "Unable to resolve" errors for packages that don't have
// a proper "exports" field (e.g. whatwg-url-without-unicode).
// Expo SDK 54 enables unstable_enablePackageExports by default
// but leaves conditionNames empty, which can break internal requires.
config.resolver.unstable_conditionNames = [
  "require",
  "react-native",
  "default",
];

module.exports = config;
