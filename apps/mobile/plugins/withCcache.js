const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Ensures ccache is enabled for iOS builds and survives prebuild --clean.
 * 1. Sets apple.ccacheEnabled in Podfile.properties.json
 * 2. Patches Podfile to propagate ccache shims to all pod targets
 */
function withCcache(config) {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const iosRoot = config.modRequest.platformProjectRoot;

      // Enable ccache flag in Podfile.properties.json
      const propsPath = path.join(iosRoot, "Podfile.properties.json");
      let props = {};
      if (fs.existsSync(propsPath)) {
        props = JSON.parse(fs.readFileSync(propsPath, "utf-8"));
      }
      props["apple.ccacheEnabled"] = "true";
      fs.writeFileSync(propsPath, JSON.stringify(props, null, 2) + "\n");

      // Patch Podfile to propagate ccache to all pod targets
      const podfilePath = path.join(iosRoot, "Podfile");
      if (fs.existsSync(podfilePath)) {
        let podfile = fs.readFileSync(podfilePath, "utf-8");

        if (!podfile.includes("[withCcache]")) {
          const ccachePatch = `
    # [withCcache] Propagate ccache to all pod targets
    if ccache_enabled?(podfile_properties) && system("which ccache > /dev/null 2>&1")
      ccache_path = File.expand_path("../.xcode-ccache", __dir__)
      installer.pods_project.targets.each do |target|
        target.build_configurations.each do |build_config|
          build_config.build_settings["CC"] = "\#{ccache_path}/clang"
          build_config.build_settings["CXX"] = "\#{ccache_path}/clang++"
        end
      end
    end
`;
          // Insert before the last `end` inside post_install (the closing of the block)
          // Find "  end\nend" at the end of the file — the post_install end + target end
          podfile = podfile.replace(
            /(\n  end\nend)\s*$/,
            `\n${ccachePatch}$1\n`
          );
          fs.writeFileSync(podfilePath, podfile);
        }
      }

      return config;
    },
  ]);
}

module.exports = withCcache;
