export const asyncTest = (value, error, time = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value) resolve(value);
      if (error) reject(error);
    }, time);
  });
};
