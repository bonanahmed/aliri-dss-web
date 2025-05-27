import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#1F3368", "#FDB813", "#3699FF"],
  chart: {
    // events: {
    //   beforeMount: (chart) => {
    //     chart.windowResizeHandler();
    //   },
    // },
    fontFamily: "Satoshi, sans-serif",
    // height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#1F3368", "#FDB813", "#3699FF"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    decimalsInFloat: 2,
    min: 0,
    max: 75.0,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: "Debit Kebutuhan",
        data: [
          1.81 + 1.81, //Januari = 3.62
          1.81 + 0.9, //Februari = 2.71
          0 + 1.5, //Maret = 1.50
          3.11 + 3.11, //April = 6.22
          2.13 + 2.14, //Mei = 4.27
          1.81 + 1.81, //Juni = 3.62
          1.81 + 0.9, //Juli = 2.71
          0.9 + 0.0, //Agustus = 0.9
          0 + 3.11, //September = 3.11
          3.11 + 2.465, //Oktober = 5.57
          1.81 + 1.81, //November = 3.62
          1.81 + 1.81, //Desember = 3.62
        ],
      },
      {
        name: "Debit Ketersediaan",
        data: [
          19.69 + 19.83, //Januari
          18.4 + 19.29, //Februari
          19.65 + 20.65, //Maret
          19.88 + 23.52, //April
          25.19 + 27.93, //Mei
          31.79 + 28.34, //Juni
          18.58 + 18.96, //Juli
          18.81 + 13.28, //Agustus
          11.59 + 10.82, //September
          10.36 + 11.44, //Oktober
          10.52 + 16.98, //November
          20.1 + 20.55, //Desember
        ],
      },
      // {
      //   name: "Debit Pembacaan",
      //   data: [
      //     2756, 1093, 847, 2193, 1734, 632, 1447, 1890, 2765, 1203, 1230, 2310,
      //   ],
      // },
    ],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };

  handleReset;

  // NextJS Requirement
  const isWindowAvailable = () => typeof window !== "undefined";

  if (!isWindowAvailable()) return <></>;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Q Kebutuhan</p>
              <p className="text-sm font-medium">01.01.2025 - 31.12.2025</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Q Ketersedian</p>
              <p className="text-sm font-medium">01.01.2025 - 31.12.20253</p>
            </div>
          </div>
          {/* <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-success">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-success"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-success">Q Pembacaan</p>
              <p className="text-sm font-medium">01.11.2022 - 31.10.2023</p>
            </div>
          </div> */}
        </div>
        {/* <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div> */}
      </div>

      <div>
        <div id="chartOne" className="-ml-5 h-[500px] w-[105%]">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            width="98%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
