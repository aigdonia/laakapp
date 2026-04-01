const upstreamTransformer = require(require.resolve('@expo/metro-config/babel-transformer', {
  paths: [require.resolve('expo/package.json')],
}))

module.exports.transform = async ({ src, filename, options }) => {
  if (filename.endsWith('.sql')) {
    return upstreamTransformer.transform({
      src: `export default ${JSON.stringify(src)}`,
      filename,
      options,
    })
  }
  return upstreamTransformer.transform({ src, filename, options })
}
