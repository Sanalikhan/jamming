const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app){
    app.use(
        '/spotify-api',
        createProxyMiddleware({
            target: 'https://api.spotify.com',
            changeOrigin: true,
            pathRewrite: { '^/spotify-api' : ''}, //remove `/spotify-api prefix
        })
    );
};