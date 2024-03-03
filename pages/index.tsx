import React, { useEffect, useState } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import { GetUserService } from "../services/user";
import { StatusEvaluation, User } from "../model";
import { useQuery } from "@tanstack/react-query";
import StatisticsCard from "../components/cards/statisticsCard";
import { statisticMenuCards } from "../data/menus";
import TableFarmer from "../components/tables/tableFarmer";
import {
  GetAllReadyRegisterFormByPage,
  RequestGetAllReadyRegisterFormByPage,
} from "../services/register-form";
import Pagination from "@mui/material/Pagination";
import { GetAllPlantTypeByGroupService } from "../services/overview";
import ChartComponent from "../components/charts/chart";
import Head from "next/head";
import DashboardLayout from "../layouts/dashboardLayout";
import { Input, SearchField } from "react-aria-components";
import { IoSearchCircleSharp } from "react-icons/io5";
import { filterRegisterForms } from "../data/filterData";

function Index({ userServer }: { userServer: User }) {
  const [registerFormsQuery, setRegisterFormsQuery] =
    useState<RequestGetAllReadyRegisterFormByPage>({
      page: 1,
      limit: 20,
      orderBy: {
        summitEvaluationDate: "desc",
      },
    });
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUserService({}),
    initialData: userServer,
  });
  const registerForms = useQuery({
    queryKey: ["register-forms", registerFormsQuery],
    queryFn: () =>
      GetAllReadyRegisterFormByPage({
        ...registerFormsQuery,
      }),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });

  const plantType = useQuery({
    queryKey: ["plant-types"],
    queryFn: () => GetAllPlantTypeByGroupService(),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });

  return (
    <DashboardLayout user={user.data}>
      <Head>
        <title>Evaluation Dashboard</title>
      </Head>
      <div className="mt-10 flex w-11/12 flex-col items-center justify-start gap-5 ">
        {(user.data.organization === "university" ||
          user.data.organization === "argiculturalProvince") && (
          <header className=" grid w-full grid-cols-4 gap-2 px-5">
            {statisticMenuCards().map((list, index) => (
              <StatisticsCard
                key={index}
                title={list.title}
                number={list.number}
              />
            ))}
          </header>
        )}
        <main className="mt-10 flex w-full flex-col items-center justify-start gap-2">
          {plantType.isLoading || !plantType.data ? (
            <div className="h-96 w-full animate-pulse bg-gray-200"></div>
          ) : (
            <ChartComponent groups={plantType} />
          )}
          <h1 className="mt-5 w-full text-left text-2xl font-extrabold text-[#5C430D]">
            รายชื่อผู้ส่งคำขอรับการประเมิน{" "}
            {user.data.organization === "argiculturalAmphure"
              ? `เฉพาะเขตอำเภอ${user.data.amphure}`
              : user.data.organization === "argiculturalTambon" &&
                `เฉพาะเขตตำบล${user.data.tambon}`}
          </h1>
          <div className="flex w-full items-center justify-between gap-3">
            <SearchField
              value={registerFormsQuery.firstName}
              onChange={(e) => {
                setRegisterFormsQuery((prev) => {
                  return {
                    ...prev,
                    firstName: e,
                  };
                });
              }}
              className="relative flex w-96 flex-col"
            >
              <Input
                placeholder="ค้นหาด้วยชื่อจริง"
                className=" h-10 rounded-lg bg-fourth-color  p-5 pl-10 outline-0 lg:w-full"
              />
              <IoSearchCircleSharp className="absolute bottom-0 left-2 top-0 m-auto text-3xl text-super-main-color" />
            </SearchField>
            <ul className="grid h-10 w-full grid-cols-4 gap-2">
              {filterRegisterForms.map((list, index) => {
                return (
                  <li
                    key={index}
                    onClick={() =>
                      setRegisterFormsQuery((prev) => {
                        return {
                          ...prev,
                          status: list.value as StatusEvaluation,
                        };
                      })
                    }
                    className={`flex h-full w-full cursor-pointer items-center text-sm transition hover:scale-105 active:scale-110
                     ${registerFormsQuery.status === list.value ? "bg-super-main-color text-white" : "bg-fourth-color text-black"}
                      justify-center rounded-sm font-semibold
                   text-super-main-color ring-1 ring-black`}
                  >
                    {list.title}
                  </li>
                );
              })}
            </ul>
          </div>
          <TableFarmer
            registerFormsQuery={registerFormsQuery}
            setRegisterFormsQuery={setRegisterFormsQuery}
            registerForms={registerForms}
          />
          <Pagination
            onChange={(e, page) =>
              setRegisterFormsQuery((prev) => {
                return {
                  ...prev,
                  page: page,
                };
              })
            }
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
