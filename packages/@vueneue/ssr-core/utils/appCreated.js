export const getAppCreated = context => {
  const callbacks = [];

  function addCallback(cb) {
    callbacks.push(cb);
  }

  addCallback.run = () => {
    for (const cb of callbacks) {
      cb(context);
    }
  };

  return addCallback;
};
