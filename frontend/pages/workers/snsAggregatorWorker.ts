const fetchSnsCode = () => {
  const getSnsByPage = async (page: number): Promise<Array<any> | string> => {
    try {
      const response = await fetch(`https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io/v1/sns/list/page/${page}/slow.json`);
      return response.json();
    } catch (e) {
      console.error("SNS Aggregator", e);
      return [];
    }
  };

  self.onmessage = async () => {
    const MAX_PAGES = 10;
    let currentPage = 0;
    let snsReturned: any[] = [];

    for (let i = 0; i < MAX_PAGES; i++) {
      try {
        const sns = await getSnsByPage(currentPage++);
        snsReturned = [...snsReturned, ...sns];
      } catch (e) {
        self.postMessage(snsReturned);
        return;
      }
    }
  };
};

let code = fetchSnsCode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "text/javascript" });
const fetch_sns_script = URL.createObjectURL(blob);

export default fetch_sns_script;
