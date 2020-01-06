/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const nodeExternals = require("webpack-node-externals")
const { GraphQLCodegenPlugin } = require('graphql-codegen-webpack');

module.exports = {
  mode: "production",
  target: 'node',
  entry: "./src/server.ts",
  output: {
    libraryTarget: 'commonjs',
    filename: `[name].js`,
    path: path.resolve(__dirname + "/build")
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.graphql']
  },
  plugins: [
    new GraphQLCodegenPlugin({
      schema: path.resolve(__dirname + '/src/schema.graphql'),
      template: 'graphql-codegen-typescript-template',
      out: path.resolve(__dirname + '/src/@types.ts'),
      overwrite: true,
    }),
  ],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test:  [/\.tsx?$/, /\.ts$/], loader: 'ts-loader' },
      { test: /\.graphql?$/, loader: 'graphql-tag/loader' }
    ]
  },
  externals: nodeExternals(),
};