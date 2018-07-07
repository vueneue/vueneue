export const asyncTest = (value, error) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value) resolve(value);
      if (error) reject(error);
    });
  });
};
