import { NumberTicker } from "@/components/number-ticker";

interface StatisticsCardProps {
  title: string;
  value: number;
}

export const StatisticsCard = ({ title, value }: StatisticsCardProps) => {
  return (
    <div className="flex flex-col justify-between w-full h-[120px] border p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-light">{title}</h2>
        <h2 className="text-sm font-light text-green-400">+12</h2>
      </div>

      <NumberTicker value={value} className="text-2xl" />
    </div>
  );
};
