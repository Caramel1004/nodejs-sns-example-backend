const { Server } = require('socket.io');
let socketIO;

module.exports = {
    init: server => {
        // path: '/socket.io'
        socketIO = new Server(server, {
            cors: {
                origin: '*',
                headers: 'Content-Type, Authorization'
            }
        });
        // console.log('socketIO: ',socketIO);
        return socketIO;
    },
    getIO: () => {
        if (!socketIO) {
            const error = new Error('소켓이 선언되지 않았습니다.');
            throw error;
        }
        return socketIO;
    }
}