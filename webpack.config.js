// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const isProduction = true;

const stylesHandler = 'style-loader';

const config = {
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: false,
    plugins: [],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
