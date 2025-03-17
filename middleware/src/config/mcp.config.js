module.exports = {
  baseUrl: process.env.MCP_API_BASE_URL || "http://localhost:3000",
  apiKey: process.env.MCP_API_KEY,
  endpoints: {
    actionCodes: "/dms/actioncodes",
  },
  defaultUser: "system",
  pageSize: 5,
};
