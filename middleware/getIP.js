const getIpAndAgent = (req, res, next) => {
    req.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.userAgent = req.headers['user-agent'];
    next();
  };
  
  module.exports = getIpAndAgent;
  