// eslint-disable-next-line import/no-anonymous-default-export

import { TimerActionTypeEnum } from "@/const";

// eslint-disable-next-line no-restricted-globals
const timerCode = () => {
  self.onmessage = () => {
    self.postMessage(TimerActionTypeEnum.Enum.TRANSACTIONS);
    setInterval(() => {
      self.postMessage(TimerActionTypeEnum.Enum.TRANSACTIONS);
    }, 5 * 60 * 1000);
    setInterval(() => {
      self.postMessage(TimerActionTypeEnum.Enum.ASSETS);
    }, 5 * 60 * 1000);
  };
};

let code = timerCode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "text/javascript" });
const timer_script = URL.createObjectURL(blob);

export default timer_script;
