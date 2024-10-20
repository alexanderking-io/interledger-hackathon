import { RecentSales } from "./RecentSales";
import { UserTransactionsChart } from "./UserTransactionsChart";

export default function Page() {
  return (
    <>
      <div className="p-8 flex flex-col gap-8">
        <UserTransactionsChart />
        <RecentSales />
      </div>
    </>
  );
}
