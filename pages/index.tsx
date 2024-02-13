import React, { useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import { GetUserService } from "../services/user";
import { User } from "../model";
import { useQuery } from "@tanstack/react-query";
import StatisticsCard from "../components/cards/statisticsCard";
import { statisticMenuCards } from "../data/menus";
import TableFarmer from "../components/tables/tableFarmer";
import { GetAllReadyRegisterFormByPage } from "../services/register-form";
import Pagination from "@mui/material/Pagination";
import { GetAllPlantTypeByGroupService } from "../services/overview";
import ChartComponent from "../components/charts/chart";

function Index({ userServer }: { userServer: User }) {
  const [page, setPage] = useState(1);
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUserService({}),
    initialData: userServer,
  });
  const registerForms = useQuery({
    queryKey: ["register-forms"],
    queryFn: () =>
      GetAllReadyRegisterFormByPage({
        page: page,
        limit: 10,
      }),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });

  const plantType = useQuery({
    queryKey: ["plant-types"],
    queryFn: () => GetAllPlantTypeByGroupService(),
  });

  return (
    <DashboardLayout user={user.data}>
      <div className="mt-10 flex w-11/12 flex-col items-center justify-start gap-5 ">
        <header className=" grid w-full grid-cols-4 gap-2 px-5">
          {statisticMenuCards().map((list, index) => (
            <StatisticsCard
              key={index}
              title={list.title}
              number={list.number}
            />
          ))}
        </header>
        <main className="mt-10 flex w-full flex-col items-center justify-start gap-2">
          {plantType.isLoading || !plantType.data ? (
            <div className="h-96 w-full animate-pulse bg-gray-200"></div>
          ) : (
            <ChartComponent groups={plantType.data} />
          )}
          <h1 className="mt-5 w-full text-left text-2xl font-extrabold text-[#5C430D]">
            รายชื่อผู้ส่งคำขอรับการประเมิน
          </h1>
          <TableFarmer registerForms={registerForms} />
          <Pagination
            onChange={(e, page) => setPage(() => page)}
            count={registerForms.data?.meta.total || 1}
            color="primary"
          />
        </main>
      </div>
    </DashboardLayout>
  );
}

export default Index;
export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  try {
    const cookies = parseCookies(ctx);
    const accessToken = cookies.access_token;
    if (accessToken) {
      const userServer = await GetUserService({
        access_token: accessToken,
      });
      return {
        props: {
          userServer,
        },
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/auth/sign-in",
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/sign-in",
      },
    };
  }
};
