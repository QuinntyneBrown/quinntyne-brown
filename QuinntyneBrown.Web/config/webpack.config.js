'use strict';

var WebpackConfig = (function () {

    function WebpackConfig() {
        return {
            resolve: {
                extensions: ["", ".js", ".ts", ".scss"]
            },
            module: {
                loaders: [
                    {
                        test: /\.ts$/, loader: "ts"
                    },
                    {
                        test: /\.css$/, loader: "style-loader!css-loader"
                    },
                    {
                        test: /\.html$/, loader: "raw"
                    },
                    {
                        test: /\.scss$/,
                        loaders: ["style", "css", "sass"]
                    }
                ]
            },
        };
    }

    return WebpackConfig;
})();

module.exports = WebpackConfig;