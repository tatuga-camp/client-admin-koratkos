import Pagination from "@mui/material/Pagination";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useState } from "react";
import { Input, SearchField } from "react-aria-components";
import { IoSearchCircleSharp } from "react-icons/io5";
import StatisticsCard from "../components/cards/statisticsCard";
import ChartPlantComponent from "../components/charts/ChartPlantComponent";
import TableFarmer from "../components/tables/tableFarmer";
import { filterRegisterForms } from "../data/filterData";
import { statisticMenuCards } from "../data/menus";
import DashboardLayout from "../layouts/dashboardLayout";
import { Amphure, StatusEvaluation, Tambon, User } from "../model";
import {
  GetAllReadyRegisterFormByPage,
  RequestGetAllReadyRegisterFormByPage,
} from "../services/register-form";
import { GetUserService } from "../services/user";
import {
  GetAllAmphuresByProvinceService,
  GetAllTambonByAmphureService,
} from "../services/thai-data";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import ChartFarmerComponent from "../components/charts/ChartFarmerComponent";

function Index({ userServer }: { userServer: User }) {
  const [selectAumpure, setselectAumpure] = useState<Amphure | null>(null);
  const [selectTambon, setSelectTambon] = useState<Tambon | null>(null);
  const [registerFormsQuery, setRegisterFormsQuery] =
    useState<RequestGetAllReadyRegisterFormByPage>({
      page: 1,
      limit: 40,
      status: null,
      orderBy: {
        summitEvaluationDate: "desc",
      },
    });
  const amphures = useQuery({
    queryKey: ["amphures"],
    queryFn: () => GetAllAmphuresByProvinceService(),
  });
  const tambons = useQuery({
    queryKey: ["tambons", { amphuresId: selectAumpure?.originalId }],
    queryFn: () => {
      if (selectAumpure) {
        return GetAllTambonByAmphureService({
          amphureId: selectAumpure.originalId,
        });
      }
    },

    enabled: !!selectAumpure,
  });
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUserService({}),
    initialData: userServer,
  });

  const registerForms = useQuery({
    queryKey: [
      "register-forms",
      {
        ...registerFormsQuery,
        amphure: selectAumpure?.name_th,
        tambon: selectTambon?.name_th,
      },
    ],
    queryFn: () =>
      GetAllReadyRegisterFormByPage({
        ...registerFormsQuery,
        amphure: selectAumpure?.name_th,
        tambon: selectTambon?.name_th,
      }),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });

  return (
    <DashboardLayout user={user.data}>
      <Head>
        <title>Evaluation Dashboard</title>
      </Head>
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
          <ChartPlantComponent user={userServer} />
          <ChartFarmerComponent />

          <h1 className="mt-5 w-full text-left text-2xl font-extrabold text-[#5C430D]">
            รายชื่อผู้ส่งคำขอรับการประเมิน{" "}
            {user.data.organization === "argiculturalAmphure"
              ? `เฉพาะเขตอำเภอ${user.data.amphure}`
              : user.data.organization === "argiculturalTambon" &&
                `เฉพาะเขตตำบล${user.data.tambon}`}
          </h1>
          <div className="flex w-full flex-wrap items-center gap-3">
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
            {userServer.role === "admin" && (
              <Dropdown
                placeholder="เลือกอำเภอ"
                value={selectAumpure}
                onChange={(e: DropdownChangeEvent) => {
                  setselectAumpure(e.value);
                  setSelectTambon(null);
                  setRegisterFormsQuery((prev) => {
                    return {
                      ...prev,
                      page: 1,
                    };
                  });
                }}
                options={amphures.data}
                optionLabel="name_th"
                className="w-60"
                loading={amphures.isLoading}
                showClear
              />
            )}
            {tambons.data && (
              <Dropdown
                placeholder="เลือกตำบล"
                value={selectTambon}
                loading={tambons.isLoading}
                onChange={(e: DropdownChangeEvent) => setSelectTambon(e.value)}
                options={tambons.data}
                optionLabel="name_th"
                className="w-60"
                showClear
              />
            )}
          </div>
          <ul className="grid h-10 w-full grid-cols-4 gap-2">
            {filterRegisterForms.map((list, index) => {
              return (
                <li
                  key={index}
                  onClick={() =>
                    setRegisterFormsQuery((prev) => {
                      return {
                        ...prev,
                        page: 1,
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
