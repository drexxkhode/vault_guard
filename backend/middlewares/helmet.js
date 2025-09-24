const helmetMiddleware = require ("helmet");

const helmet = helmetMiddleware({
contentSecurityPolicy :{
    directives: {
      defaultSrc: ["'none'"], // Explicitly block everything by default
      scriptSrc: ["'self'"], // Allow scripts only from your domain
      styleSrc: ["'self'"], // Allow CSS only from your domain
      imgSrc: ["'self'", "data:"], // Allow images from self + data URIs (e.g., inline images)
      connectSrc: ["'self'"], // Restrict APIs/fetch calls to your domain
      fontSrc: ["'self'"], // Allow fonts from your domain
      frameSrc: ["'none'"], // Block iframes (prevent clickjacking)
      objectSrc: ["'none'"], // Block plugins (Flash, PDF, etc.)
      formAction: ["'self'"], // Restrict form submissions to your domain
      // Optional: Add reporting for violations (replace with your endpoint)
      reportUri: "/csp-violation-report-endpoint",
    },
}
});

module.exports = helmet;