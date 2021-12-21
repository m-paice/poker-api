let instanceSocket = null;

export const getSocket = () => instanceSocket;

export const setSocket = (socket) => {
  instanceSocket = socket;
};
