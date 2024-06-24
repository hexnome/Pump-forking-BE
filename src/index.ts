import { createServer } from 'http'
import app from './app'
import socketio from './sockets'
import { logger } from './sockets/logger';

// Socket communication
const server = createServer(app);
socketio(server);

/**
 * start Express server
 */
server.listen(app.get('port'), () => {
  logger.info('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
})

export default server;