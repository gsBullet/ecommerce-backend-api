const { spawn } = require("child_process");

function start() {
  const app = spawn("node", ["./app.js"], {
    stdio: "inherit",
  });

  app.on("exit", (code) => {
    console.log(`Server crashed with code ${code}. Restarting in 1 second...`);
    setTimeout(start, 1000);
  });
}
start();
module.exports =()=> start;