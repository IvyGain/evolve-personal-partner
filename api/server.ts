/**
 * EVOLVE - Personal Evolution Partner Server Entry
 */
import app, { server } from './app.js';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log(`🚀 EVOLVE Server ready on port ${PORT}`);
  console.log(`🎯 AI Coaching API: http://localhost:${PORT}/api`);
  console.log(`🔊 WebSocket for voice: ws://localhost:${PORT}`);
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;