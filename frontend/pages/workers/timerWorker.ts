// eslint-disable-next-line no-restricted-globals
const timerCode = () => {
  self.onmessage = () => {
    self.postMessage("TRANSACTIONS");
    setInterval(() => {
      self.postMessage("TRANSACTIONS");
    }, 10 * 60 * 1000);
    setInterval(() => {
      self.postMessage("ASSETS");
    }, 10 * 60 * 1000);
  };
};

let code = timerCode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "text/javascript" });
const timer_script = URL.createObjectURL(blob);

export default timer_script;
