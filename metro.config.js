// metro.config.js - MonTaxi
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclusion stricte des dossiers de build natifs et caches pour éviter les verrous EBUSY sous Windows
const defaultBlockList = config.resolver.blockList || [];
const blockListPatterns = Array.isArray(defaultBlockList)
  ? defaultBlockList
  : typeof defaultBlockList === 'object' && defaultBlockList instanceof RegExp
  ? [defaultBlockList]
  : [];

config.resolver.blockList = [
  ...blockListPatterns,
  /.*[/\\]android[/\\]build[/\\].*/,
  /.*[/\\]android[/\\]app[/\\]build[/\\].*/,
  /.*[/\\]android[/\\]\.gradle[/\\].*/,
  /.*[/\\]node_modules[/\\](\.bin|.*[/\\](android|ios)[/\\]build)[/\\].*/,
  /.*[/\\]node_modules[/\\]expo[/\\]android[/\\]build[/\\].*/,
  /.*[/\\]node_modules[/\\]expo-av[/\\]android[/\\]build[/\\].*/
];

module.exports = config;
