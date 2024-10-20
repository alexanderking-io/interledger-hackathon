"use client";

import * as React from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

const chartData = [
  { date: "2024-04-01", successfulTransactions: 2220, failedTransactions: 1 },
  { date: "2024-04-02", successfulTransactions: 970, failedTransactions: 4 },
  { date: "2024-04-03", successfulTransactions: 1607, failedTransactions: 5 },
  { date: "2024-04-04", successfulTransactions: 2402, failedTransactions: 2 },
  { date: "2024-04-05", successfulTransactions: 3703, failedTransactions: 5 },
  { date: "2024-04-06", successfulTransactions: 3001, failedTransactions: 12 },
  { date: "2024-04-07", successfulTransactions: 2405, failedTransactions: 3 },
  { date: "2024-04-08", successfulTransactions: 4009, failedTransactions: 5 },
  { date: "2024-04-09", successfulTransactions: 509, failedTransactions: 4 },
  { date: "2024-04-10", successfulTransactions: 2061, failedTransactions: 7 },
  { date: "2024-04-11", successfulTransactions: 3027, failedTransactions: 1 },
  { date: "2024-04-12", successfulTransactions: 2092, failedTransactions: 3 },
  { date: "2024-04-13", successfulTransactions: 3402, failedTransactions: 5 },
  { date: "2024-04-14", successfulTransactions: 1370, failedTransactions: 5 },
  { date: "2024-04-15", successfulTransactions: 1200, failedTransactions: 4 },
  { date: "2024-04-16", successfulTransactions: 1380, failedTransactions: 7 },
  { date: "2024-04-17", successfulTransactions: 4460, failedTransactions: 8 },
  { date: "2024-04-18", successfulTransactions: 3640, failedTransactions: 11 },
  { date: "2024-04-19", successfulTransactions: 2430, failedTransactions: 4 },
  { date: "2024-04-20", successfulTransactions: 890, failedTransactions: 5 },
  { date: "2024-04-21", successfulTransactions: 1370, failedTransactions: 9 },
  { date: "2024-04-22", successfulTransactions: 2240, failedTransactions: 1 },
  { date: "2024-04-23", successfulTransactions: 1380, failedTransactions: 2 },
  { date: "2024-04-24", successfulTransactions: 3870, failedTransactions: 2 },
  { date: "2024-04-25", successfulTransactions: 2150, failedTransactions: 5 },
  { date: "2024-04-26", successfulTransactions: 750, failedTransactions: 7 },
  { date: "2024-04-27", successfulTransactions: 3830, failedTransactions: 8 },
  { date: "2024-04-28", successfulTransactions: 1220, failedTransactions: 9 },
  { date: "2024-04-29", successfulTransactions: 3150, failedTransactions: 1 },
  { date: "2024-04-30", successfulTransactions: 4540, failedTransactions: 1 },
  { date: "2024-05-01", successfulTransactions: 1650, failedTransactions: 1 },
  { date: "2024-05-02", successfulTransactions: 2930, failedTransactions: 0 },
  { date: "2024-05-03", successfulTransactions: 2470, failedTransactions: 4 },
  { date: "2024-05-04", successfulTransactions: 3850, failedTransactions: 7 },
  { date: "2024-05-05", successfulTransactions: 4810, failedTransactions: 8 },
  { date: "2024-05-06", successfulTransactions: 4980, failedTransactions: 9 },
  { date: "2024-05-07", successfulTransactions: 3880, failedTransactions: 1 },
  { date: "2024-05-08", successfulTransactions: 1490, failedTransactions: 6 },
  { date: "2024-05-09", successfulTransactions: 2270, failedTransactions: 1 },
  { date: "2024-05-10", successfulTransactions: 2930, failedTransactions: 3 },
  { date: "2024-05-11", successfulTransactions: 3350, failedTransactions: 5 },
  { date: "2024-05-12", successfulTransactions: 1970, failedTransactions: 5 },
  { date: "2024-05-13", successfulTransactions: 1970, failedTransactions: 2 },
  { date: "2024-05-14", successfulTransactions: 4480, failedTransactions: 1 },
  { date: "2024-05-15", successfulTransactions: 4730, failedTransactions: 1 },
  { date: "2024-05-16", successfulTransactions: 3380, failedTransactions: 0 },
  { date: "2024-05-17", successfulTransactions: 4990, failedTransactions: 1 },
  { date: "2024-05-18", successfulTransactions: 3150, failedTransactions: 2 },
  { date: "2024-05-19", successfulTransactions: 2350, failedTransactions: 2 },
  { date: "2024-05-20", successfulTransactions: 1770, failedTransactions: 5 },
  { date: "2024-05-21", successfulTransactions: 820, failedTransactions: 9 },
  { date: "2024-05-22", successfulTransactions: 810, failedTransactions: 11 },
  { date: "2024-05-23", successfulTransactions: 2520, failedTransactions: 6 },
  { date: "2024-05-24", successfulTransactions: 2940, failedTransactions: 4 },
  { date: "2024-05-25", successfulTransactions: 2010, failedTransactions: 1 },
  { date: "2024-05-26", successfulTransactions: 2130, failedTransactions: 1 },
  { date: "2024-05-27", successfulTransactions: 4200, failedTransactions: 0 },
  { date: "2024-05-28", successfulTransactions: 2330, failedTransactions: 1 },
  { date: "2024-05-29", successfulTransactions: 780, failedTransactions: 4 },
  { date: "2024-05-30", successfulTransactions: 3400, failedTransactions: 5 },
  { date: "2024-05-31", successfulTransactions: 1780, failedTransactions: 1 },
  { date: "2024-06-01", successfulTransactions: 1780, failedTransactions: 1 },
  { date: "2024-06-02", successfulTransactions: 4700, failedTransactions: 8 },
  { date: "2024-06-03", successfulTransactions: 1030, failedTransactions: 10 },
  { date: "2024-06-04", successfulTransactions: 4390, failedTransactions: 1 },
  { date: "2024-06-05", successfulTransactions: 880, failedTransactions: 5 },
  { date: "2024-06-06", successfulTransactions: 2940, failedTransactions: 1 },
  { date: "2024-06-07", successfulTransactions: 3230, failedTransactions: 1 },
  { date: "2024-06-08", successfulTransactions: 3850, failedTransactions: 2 },
  { date: "2024-06-09", successfulTransactions: 4380, failedTransactions: 3 },
  { date: "2024-06-10", successfulTransactions: 1550, failedTransactions: 3 },
  { date: "2024-06-11", successfulTransactions: 920, failedTransactions: 5 },
  { date: "2024-06-12", successfulTransactions: 4920, failedTransactions: 2 },
  { date: "2024-06-13", successfulTransactions: 810, failedTransactions: 8 },
  { date: "2024-06-14", successfulTransactions: 4260, failedTransactions: 7 },
  { date: "2024-06-15", successfulTransactions: 3070, failedTransactions: 1 },
  { date: "2024-06-16", successfulTransactions: 3710, failedTransactions: 1 },
  { date: "2024-06-17", successfulTransactions: 4750, failedTransactions: 6 },
  { date: "2024-06-18", successfulTransactions: 1070, failedTransactions: 3 },
  { date: "2024-06-19", successfulTransactions: 3410, failedTransactions: 1 },
  { date: "2024-06-20", successfulTransactions: 4080, failedTransactions: 3 },
  { date: "2024-06-21", successfulTransactions: 1690, failedTransactions: 1 },
  { date: "2024-06-22", successfulTransactions: 3170, failedTransactions: 2 },
  { date: "2024-06-23", successfulTransactions: 4800, failedTransactions: 3 },
  { date: "2024-06-24", successfulTransactions: 1320, failedTransactions: 3 },
  { date: "2024-06-25", successfulTransactions: 1410, failedTransactions: 2 },
  { date: "2024-06-26", successfulTransactions: 4340, failedTransactions: 3 },
  { date: "2024-06-27", successfulTransactions: 4480, failedTransactions: 2 },
  { date: "2024-06-28", successfulTransactions: 1490, failedTransactions: 2 },
  { date: "2024-06-29", successfulTransactions: 1030, failedTransactions: 5 },
  { date: "2024-06-30", successfulTransactions: 4460, failedTransactions: 7 },
];

const chartConfig = {
  views: {
    label: "Transactions",
  },
  successfulTransactions: {
    label: "Successful",
    color: "hsl(var(--chart-2))",
  },
  failedTransactions: {
    label: "Failed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function UserTransactionsChart() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("successfulTransactions");

  const total = React.useMemo(
    () => ({
      successfulTransactions: chartData.reduce((acc, curr) => acc + curr.successfulTransactions, 0),
      failedTransactions: chartData.reduce((acc, curr) => acc + curr.failedTransactions, 0),
    }),
    [],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Transaction Totals</CardTitle>
          <CardDescription>Showing total transactions for the last 3 months</CardDescription>
        </div>
        <div className="flex">
          {["successfulTransactions", "failedTransactions"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
