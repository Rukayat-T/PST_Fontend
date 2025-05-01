import { useOnboarding } from "@/context/OnboardingContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import RecentActivityCard from "../RecentActivityCard";
import PopularProjectCard from "../PopularProjectCard";
import { useEffect, useState } from "react";
import DashboardService from "@/services/DashboardServices/dashboard.service";
import {
  ITutorMetric,
  ITutorPopularProject,
  ITutorRecentActivity,
} from "@/models/proposal.model";
import { formatString } from "@/utils/helpers";
import { get } from "http";

const datap = [
  { name: "Active", value: 0, color: "#8979FF" },
  { name: "Assigned", value: 0, color: "#FF5C53" },
  { name: "Drafts", value: 0, color: "#41C1E0" },
];
function Overview() {
  const { user } = useOnboarding();
  const [isFetching, setIsfetching] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<ITutorMetric>();
  const [recentActivites, setRecentActivities] = useState<
    ITutorRecentActivity[]
  >([]);
  const [data, setData] = useState<any[]>([]);

  const [pieData, setPieData] = useState<any[]>([]);
  const [popularProjects, setPopularProjects] = useState<
    ITutorPopularProject[]
  >([]);
  const profileId = user?.user?.profileId;
  function updateDataValues(dataArray: any, newValues: any) {
    return dataArray.map((item: any) => {
      const key = item.name.toLowerCase();
      if (newValues.hasOwnProperty(key)) {
        return { ...item, value: newValues[key] };
      }
      return item;
    });
  }
  const getTutorMetrics = async (id: number) => {
    setIsfetching(true);
    try {
      const res = await DashboardService.getTutorMetric(id);
      if (res.status === 200) {
        setIsfetching(false);
        console.log(res.response, "projects");
        setMetrics(res.response);
        // setTotalCount(res.response.pagination.totalPages);
      } else {
        setIsfetching(false);
        console.log(res.message);
      }
    } catch (error) {
      setIsfetching(false);
      console.log(error);
    }
  };
  const getTutorAppCountByWeek = async () => {
    setIsfetching(true);
    try {
      const res = await DashboardService.getTutorAppCountByWeek();
      if (res.status === 200) {
        setIsfetching(false);
        setData(
          res.response.map((item: any, index: number) => {
            return {
              name: `week ${index + 1}`,
              applications: item.count,
            };
          })
        );
        // setTotalCount(res.response.pagination.totalPages);
      } else {
        setIsfetching(false);
        console.log(res.message);
      }
    } catch (error) {
      setIsfetching(false);
      console.log(error);
    }
  };
  const getTutorRecentActivities = async (id: number) => {
    setIsfetching(true);
    try {
      const res = await DashboardService.getTutorRecentActivities(id);
      if (res.status === 201) {
        setIsfetching(false);
        console.log(res.response, "projects");
        setRecentActivities(res.response);
        // setTotalCount(res.response.pagination.totalPages);
      } else {
        setIsfetching(false);
        console.log(res.message);
      }
    } catch (error) {
      setIsfetching(false);
      console.log(error);
    }
  };
  const getTutorPopularProjects = async (id: number) => {
    setIsfetching(true);
    try {
      const res = await DashboardService.getTutorPopularProjects(id);
      if (res.status === 201) {
        setIsfetching(false);
        console.log(res.response, "projects");
        setPopularProjects(res.response);
        // setTotalCount(res.response.pagination.totalPages);
      } else {
        setIsfetching(false);
        console.log(res.message);
      }
    } catch (error) {
      setIsfetching(false);
      console.log(error);
    }
  };
  const getTutorStatusDistribution = async (id: number) => {
    setIsfetching(true);
    try {
      const res = await DashboardService.getTutorStatusDistribution(id);
      if (res.status === 201) {
        setIsfetching(false);
        console.log(updateDataValues(datap, res.response));
        setPieData(
          updateDataValues(datap, res.response).filter(
            (item: any) => item.value > 0
          )
        );
      } else {
        setIsfetching(false);
        console.log(res.message);
      }
    } catch (error) {
      setIsfetching(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (profileId) {
      getTutorMetrics(profileId);
      getTutorRecentActivities(profileId);
      getTutorPopularProjects(profileId);
      getTutorStatusDistribution(profileId);
      getTutorAppCountByWeek();
    }
  }, [profileId]);
  const topInfo = [
    { name: "Active Projects", number: 6 },
    { name: "Student Applications", number: 5 },
    { name: "Project Proposals", number: 8 },
    { name: "Assigned Projects", number: 3 },
  ];

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const tbd = [1, 4];

  return (
    <>
      <div className="">
        <div className="intro mt-8 mb-4">
          <div className="text">
            <p className="pb-2 text-xl font-semibold">
              Hello {user?.user?.name}, welcome to your dashboard.
            </p>
            <p>You have: </p>
          </div>
        </div>
        <div className="topInfo mx-20 flex gap-x-5 justify-between items-center">
          {Object.keys(metrics || {}).map((info: string, index: number) => (
            <div
              className="bg-lightPurple-20 border border-darkPurple rounded-xl py-1 px-4"
              key={index}
            >
              {metrics && metrics[info]} {formatString(info)}
            </div>
          ))}
        </div>
      </div>
      <div className="graphs mt-5 mx-5 gap-8 flex justify-between">
        <div className="graph1 flex flex-col  bg-[#F6F6F6] rounded-xl p-5 gap-3 h-[350px] w-full">
          <p className="text-xl font-semibold ">Application Trends</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={600}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {/* @ts-ignore */}
              <XAxis dataKey="name" />
              {/* @ts-ignore */}
              <YAxis />
              {/* @ts-ignore */}
              <Tooltip />
              {/* @ts-ignore */}
              <Legend />
              {/* @ts-ignore */}
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#8979FF"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="graph1 flex flex-col bg-[#F6F6F6] rounded-xl p-5 h-[350px] w-full">
          <p className="text-xl font-semibold ">
            Project Status Distribution
          </p>
          {pieData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ right: 30 }}>
                {/* @ts-ignore */}
                <Pie
                  data={pieData}
                  cx="45%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  innerRadius={40}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-700 ease-in-out hover:opacity-80 hover:scale-105"
                    />
                  ))}
                </Pie>
                {/* @ts-ignore */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    padding: "8px 12px",
                  }}
                />
                {/* @ts-ignore */}
                <Legend
                  content={<CustomLegend />}
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="section my-5 mx-5  flex gap-5 justify-between">
        <div className="graph1 bg-[#F6F6F6] rounded-xl p-5 h-[38vh] w-[55%]">
          <p className="text-xl font-semibold ">Recent Activity</p>
          <div className="h-[30vh] overflow-y-scroll scrollbar-custom">
            {recentActivites.map((item, index) => (
              <RecentActivityCard
                item={item}
                key={index}
                className={`w-full ${
                  index != recentActivites.length - 1
                    ? "border-b-[1px] border-[#00000027]"
                    : ""
                }  flex px-5 py-2 flex-col gap-1`}
              />
            ))}
          </div>
        </div>
        <div className="graph1 bg-[#F6F6F6] rounded-xl p-5 h-[38vh] w-[42.5%]">
          <p className="text-xl font-semibold ">Popular Projects</p>
          <div className="h-[30vh] overflow-y-scroll scrollbar-custom ">
            {popularProjects.map((item, index) => (
              <PopularProjectCard
                item={item}
                key={index}
                className={`w-full ${
                  index != popularProjects.length - 1
                    ? "border-b-[1px] border-[#00000027]"
                    : ""
                }  flex px-5 py-2 flex-col gap-1`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Overview;
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-col justify-center gap-2 mt-6">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={"w-1 h-1 rounded-full"}
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-gray-600">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};
