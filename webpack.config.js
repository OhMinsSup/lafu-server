/* eslint-disable @typescript-eslint/no-var-requires */
const { GraphQLCodegenPlugin } = require('graphql-codegen-webpack');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProd ? 'production' : 'development',
    devtool: 'inline-source-map',
    entry: './src/servers.ts',
    target: 'node',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.graphql']
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js'
    },
    plugins: [
        new GraphQLCodegenPlugin({
          schema: resolve(__dirname, 'src/schema.graphql'),
          template: 'graphql-codegen-typescript-template',
          out: resolve(__dirname, 'src/types.ts'),
          overwrite: true,
        }),
    ],
    module: {
        rules: [
          // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
          { test:  [/\.tsx?$/, /\.ts$/], loader: 'ts-loader' },
          { test: /\.graphql?$/, loader: 'graphql-tag/loader' }
        ]
    }
};