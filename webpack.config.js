const path = require("path");
const WebpackShellPlugin = require('webpack-shell-plugin-next');
module.exports = {
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", "jsx"]
    },
    entry: "./tmp/app.tsx",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildStart: {
                scripts: ['babel src -d tmp --extensions .ts,.tsx,.js,.jsx --keep-file-extension'],
                blocking: true
            }
        })
    ]
};
