/**
 * Custom Expo config plugin that:
 * 1. Pins Gradle to 8.x (React Native 0.83 is incompatible with Gradle 9 due
 *    to foojay-resolver-convention referencing removed IBM_SEMERU constant).
 * 2. Writes android/local.properties from ANDROID_HOME env var if present.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const GRADLE_8_URL =
  'https\\://services.gradle.org/distributions/gradle-8.13-bin.zip';

const withGradleProperties = (config) => {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const androidRoot = path.join(projectRoot, 'android');

      // 1. Pin Gradle wrapper to 8.13
      const wrapperPath = path.join(
        androidRoot,
        'gradle',
        'wrapper',
        'gradle-wrapper.properties'
      );
      if (fs.existsSync(wrapperPath)) {
        let content = fs.readFileSync(wrapperPath, 'utf8');
        content = content.replace(
          /distributionUrl=.*gradle-\d+\.\d+.*-bin\.zip/,
          `distributionUrl=${GRADLE_8_URL}`
        );
        fs.writeFileSync(wrapperPath, content, 'utf8');
      }

      // 2. Write local.properties from ANDROID_HOME if not already present
      const localPropsPath = path.join(androidRoot, 'local.properties');
      const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
      if (androidHome && !fs.existsSync(localPropsPath)) {
        const sdkDir = androidHome.replace(/\\/g, '\\\\');
        fs.writeFileSync(
          localPropsPath,
          `sdk.dir=${sdkDir}\n`,
          'utf8'
        );
      }

      return cfg;
    },
  ]);
};

module.exports = withGradleProperties;
