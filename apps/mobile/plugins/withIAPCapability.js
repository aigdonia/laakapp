const { withXcodeProject } = require("expo/config-plugins");

/**
 * Adds the In-App Purchase capability to the Xcode project.
 * Required by Apple for StoreKit to fetch products.
 * Survives `npx expo prebuild --clean`.
 */
function withIAPCapability(config) {
  return withXcodeProject(config, (config) => {
    const project = config.modResults;
    const targetName = config.modRequest.projectName;

    // Find the main app target
    const targets = project.pbxNativeTargetSection();
    let targetUuid;
    for (const key in targets) {
      if (
        !key.endsWith("_comment") &&
        targets[key].name === `"${targetName}"`
      ) {
        targetUuid = key;
        break;
      }
    }

    if (!targetUuid) {
      console.warn(
        "[withIAPCapability] Could not find target, skipping capability"
      );
      return config;
    }

    // Add the In-App Purchase system capability
    project.addTargetAttribute("SystemCapabilities", {
      "com.apple.InAppPurchase": { enabled: 1 },
    }, targetUuid);

    return config;
  });
}

module.exports = withIAPCapability;
