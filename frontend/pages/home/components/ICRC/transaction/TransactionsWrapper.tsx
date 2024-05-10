import { useState } from "react";
import TransactionsTable from "./TransactionsTable";
// import { deChunkTransactions } from "@pages/home/helpers/mappers";
import { useAppSelector } from "@redux/Store";
import { throttle } from "lodash";

export default function TransactionsWrapper() {
  const { transactions } = useAppSelector((state) => state.transaction.list);
  const [chunkNumber, setChunkNumber] = useState(1);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // useEffect(() => {
  //   const data = deChunkTransactions({
  //     transactions,
  //     chunkNumber: chunkNumber + 1,
  //     from: chunkNumber,
  //   });
  // }, [transactions]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const isScrolledToBottom = element.scrollHeight - element.clientHeight <= element.scrollTop;

    if (isScrolledToBottom && !isAtBottom) {
      setIsAtBottom(true);
      if (transactions.length < chunkNumber) return;

      const loadMore = throttle(() => {
        console.log("Load more data");
        setChunkNumber((prev) => prev + 1);
      }, 1000);

      loadMore();
    } else if (!isScrolledToBottom) {
      setIsAtBottom(false);
    }
  };

  return <TransactionsTable onScroll={onScroll} transactions={[]} />;
}
