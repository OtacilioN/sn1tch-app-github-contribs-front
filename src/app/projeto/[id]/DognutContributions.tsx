"use client";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const DognutContributions = ({
  userSummary,
}: {
  userSummary?: {
    userEmail: string;
    userSummary: string;
    contributionCounts: { type: string; count: number }[];
  };
}) => {
  if (!userSummary) {
    return null;
  }

  const data = {
    labels: userSummary.contributionCounts.map((item) => item.type),
    datasets: [
      {
        label: "Tipos de contribuições",
        data: userSummary.contributionCounts.map((item) => item.count),
        hoverOffset: 4,
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default DognutContributions;
