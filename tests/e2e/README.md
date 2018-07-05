**If you want to run perfs & memory leaks tests:**

Install node-clinic globally:

```bash
npm i -g clinic
```

Then do this commands, in this directory:

```bash
node index.js --noRun
cd ../../packages/tests
node perfs.js
```

You will see the node-clinic report at the end of the tests
