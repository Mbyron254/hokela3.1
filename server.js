const { createServer } = require('http');
const { parse } = require('url');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const next = require('next');

const HEADER_KEY_CLIENT = 'Client';
const HEADER_VAL_CLIENT = 'APP_WEBSITE';
const dev = process.env.NODE_ENV !== 'production';

const SCHEME = dev ? 'http' : 'https';
const HOST_SERVER = dev ? 'localhost' : 'hokela-api-test-xhutk.ondigitalocean.app';
const HOST_CLIENT = dev ? 'localhost' : 'hokela360-srld9.ondigitalocean.app';
const PORT = dev ? 3001 : 8080;
const BLOB_ORIGIN_DEV = 'http://localhost:3000';
const BLOB_ORIGIN_PRO = 'https://hokela360.blr1.digitaloceanspaces.com';

const app = next({ dev, port: PORT, hostname: HOST_CLIENT });
const nextHandler = app.getRequestHandler();

const proxyGQL = createProxyMiddleware({
  logLevel: 'warn',
  target: dev ? `${SCHEME}://${HOST_SERVER}:3000/graphql` : `${SCHEME}://${HOST_SERVER}/graphql`,
  changeOrigin: true,
  ignorePath: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader(HEADER_KEY_CLIENT, HEADER_VAL_CLIENT);
    fixRequestBody(proxyReq, req);
  },
  onError: (proxyError, req, res, target) => {
    console.log('::::::: Proxy error GQL: ', proxyError);
  },
});
const proxyFR = createProxyMiddleware({
  logLevel: 'warn',
  target: dev ? BLOB_ORIGIN_DEV : BLOB_ORIGIN_PRO,
  changeOrigin: true,
  ignorePath: false,
  pathRewrite: (path, req) => {
    const filename = path.split('/')[3];

    return dev ? `/document/f/${filename}` : `/docstore/${filename}`;
  },
  onProxyReq: (proxyReq, req, res) => {
    if (dev) {
      proxyReq.setHeader(HEADER_KEY_CLIENT, HEADER_VAL_CLIENT);
    }
  },
  onError: (proxyError, req, res, target) => {
    console.log('::::::: Proxy error FR: ', proxyError);
  },
});
const proxyFD = createProxyMiddleware({
  logLevel: 'warn',
  target: dev ? `${SCHEME}://${HOST_SERVER}:3000` : `${SCHEME}://${HOST_SERVER}`,
  changeOrigin: true,
  ignorePath: false,
  pathRewrite: (path, req) => {
    const fileId = path.split('/')[3];

    return `/document/d/${fileId}`;
  },
  onProxyReq: (proxyReq, req, res) => {
    if (dev) {
      proxyReq.setHeader(HEADER_KEY_CLIENT, HEADER_VAL_CLIENT);
    }
  },
  onError: (proxyError, req, res, target) => {
    console.log('::::::: Proxy error FD: ', proxyError);
  },
});

const proxyCSVDSurveyReports = createProxyMiddleware({
  logLevel: 'warn',
  target: dev ? `${SCHEME}://${HOST_SERVER}:3000` : `${SCHEME}://${HOST_SERVER}`,
  changeOrigin: true,
  ignorePath: false,
  pathRewrite: (path, req) => {
    return '/excel/survey-reports';
  },
  onProxyReq: (proxyReq, req, res) => {
    if (dev) {
      proxyReq.setHeader(HEADER_KEY_CLIENT, HEADER_VAL_CLIENT);
    }
  },
  onError: (proxyError, req, res, target) => {
    console.log('::::::: Proxy error CSV DSurvey Reports: ', proxyError);
  },
});
const proxyCSVDAgents = createProxyMiddleware({
  logLevel: 'warn',
  target: dev ? `${SCHEME}://${HOST_SERVER}:3000` : `${SCHEME}://${HOST_SERVER}`,
  changeOrigin: true,
  ignorePath: false,
  pathRewrite: (path, req) => {
    return '/excel/agents';
  },
  onProxyReq: (proxyReq, req, res) => {
    if (dev) {
      proxyReq.setHeader(HEADER_KEY_CLIENT, HEADER_VAL_CLIENT);
    }
  },
  onError: (proxyError, req, res, target) => {
    console.log('::::::: Proxy error CSVD Agents: ', proxyError);
  },
});
const proxyCSVDAgentsRunOffers = createProxyMiddleware({
  logLevel: 'warn',
  target: dev ? `${SCHEME}://${HOST_SERVER}:3000` : `${SCHEME}://${HOST_SERVER}`,
  changeOrigin: true,
  ignorePath: false,
  pathRewrite: (path, req) => {
    return '/excel/agents-run-offers';
  },
  onProxyReq: (proxyReq, req, res) => {
    if (dev) {
      proxyReq.setHeader(HEADER_KEY_CLIENT, HEADER_VAL_CLIENT);
    }
  },
  onError: (proxyError, req, res, target) => {
    console.log('::::::: Proxy error CSVD Agents Run Offers: ', proxyError);
  },
});
const proxyCSVDAgentsRunSalesCumulative = createProxyMiddleware({
  logLevel: 'warn',
  target: dev ? `${SCHEME}://${HOST_SERVER}:3000` : `${SCHEME}://${HOST_SERVER}`,
  changeOrigin: true,
  ignorePath: false,
  pathRewrite: (path, req) => {
    return '/excel/agents-run-sales-cumulative';
  },
  onProxyReq: (proxyReq, req, res) => {
    if (dev) {
      proxyReq.setHeader(HEADER_KEY_CLIENT, HEADER_VAL_CLIENT);
    }
  },
  onError: (proxyError, req, res, target) => {
    console.log('::::::: Proxy error CSVD Agents Run Sales Cumulative: ', proxyError);
  },
});
const proxyCSVDAgentsRunSalesDaily = createProxyMiddleware({
  logLevel: 'warn',
  target: dev ? `${SCHEME}://${HOST_SERVER}:3000` : `${SCHEME}://${HOST_SERVER}`,
  changeOrigin: true,
  ignorePath: false,
  pathRewrite: (path, req) => {
    return '/excel/agents-run-sales-daily';
  },
  onProxyReq: (proxyReq, req, res) => {
    if (dev) {
      proxyReq.setHeader(HEADER_KEY_CLIENT, HEADER_VAL_CLIENT);
    }
  },
  onError: (proxyError, req, res, target) => {
    console.log('::::::: Proxy error CSVD Agents Run Sales Daily: ', proxyError);
  },
});

app.prepare().then(() => {
  createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === '/graphql') {
        return proxyGQL(req, res);
      } else {
        const path_parts = pathname.split('/');
        const isFR = path_parts[1] === 'document' && path_parts[2] === 'f';
        const isFD = path_parts[1] === 'document' && path_parts[2] === 'd';
        const isCSVD_SR = path_parts[1] === 'excel' && path_parts[2] === 'survey-reports';
        const isCSVD_A = path_parts[1] === 'excel' && path_parts[2] === 'agents';
        const isCSVD_ARO = path_parts[1] === 'excel' && path_parts[2] === 'agents-run-offers';
        const isCSVD_ARSC = path_parts[1] === 'excel' && path_parts[2] === 'agents-run-sales-cumulative';
        const isCSVD_ARSD = path_parts[1] === 'excel' && path_parts[2] === 'agents-run-sales-daily';


        if (isFR) {
          return proxyFR(req, res);
        } else if (isFD) {
          return proxyFD(req, res);
        } else if (isCSVD_SR) {
          return proxyCSVDSurveyReports(req, res);
        } else if (isCSVD_A) {
          return proxyCSVDAgents(req, res);
        } else if (isCSVD_ARO) {
          return proxyCSVDAgentsRunOffers(req, res);
        } else if (isCSVD_ARSC) {
          return proxyCSVDAgentsRunSalesCumulative(req, res);
        } else if (isCSVD_ARSD) {
          return proxyCSVDAgentsRunSalesDaily(req, res);
        } else {
          nextHandler(req, res, parsedUrl);
        }
      }
    } catch (err) {
      console.error('Error handling: ', req.url, err);

      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(PORT, () => {
    console.log(`> Ready on ${SCHEME}://${HOST_CLIENT}:${PORT}`);
  });
});
