import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useState } from "react";
import { IconType } from "react-icons";
import { LuCheckCircle2, LuClock, LuSearch, LuUsers, LuXCircle } from "react-icons/lu";
import StatisticsCard, { StatisticsTone } from "../components/cards/statisticsCard";
import ChartPlantComponent from "../components/charts/ChartPlantComponent";
import TableFarmer from "../components/tables/tableFarmer";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
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
import Select from "../components/ui/Select";
import ChartFarmerComponent from "../components/charts/ChartFarmerComponent";

const statisticAppearance: Record<
  "all" | StatusEvaluation,
  { icon: IconType; tone: StatisticsTone }
> = {
  all: { icon: LuUsers, tone: "neutral" },
  pending: { icon: LuClock, tone: "pending" },
  approved: { icon: LuCheckCircle2, tone: "approved" },
  rejected: { icon: LuXCircle, tone: "rejected" },
};

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

  const selectStatus = (status: StatusEvaluation | null) =>
    setRegisterFormsQuery((prev) => ({ ...prev, page: 1, status }));

  const areaScope =
    user.data.organization === "argiculturalAmphure"
      ? `เฉพาะเขตอำเภอ${user.data.amphure}`
      : user.data.organization === "argiculturalTambon"
        ? `เฉพาะเขตตำบล${user.data.tambon}`
        : "ทุกพื้นที่ในจังหวัดนครราชสีมา";

  return (
    <DashboardLayout user={user.data}>
      <Head>
        <title>ภาพรวมการตรวจประเมิน | Korat KOS</title>
      </Head>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="ภาพรวมการตรวจประเมิน"
          description={`สวัสดี คุณ${user.data.firstName} ข้อมูล${areaScope}`}
        />

        <section
          aria-label="สรุปจำนวนเกษตรกรและผลการประเมิน"
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {statisticMenuCards().map((card) => {
            const appearance = statisticAppearance[card.status ?? "all"];
            return (
              <StatisticsCard
                key={card.title}
                title={card.title}
                number={card.number}
                icon={appearance.icon}
                tone={appearance.tone}
                selected={registerFormsQuery.status === card.status}
                onClick={() => {
                  selectStatus(card.status);
                  document
                    .getElementById("register-forms")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            );
          })}
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          <ChartPlantComponent user={userServer} />
          <ChartFarmerComponent />
        </div>

        <section id="register-forms" className="card scroll-mt-20">
          <div className="card-header">
            <div>
              <h2 className="card-title">คำขอรับการประเมิน</h2>
              <p className="text-sm text-super-main-color/80">{areaScope}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-third-color px-4 py-3 sm:px-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <div className="segmented" role="group" aria-label="กรองตามสถานะ">
                {filterRegisterForms.map((filter) => (
                  <button
                    type="button"
                    key={filter.title}
                    onClick={() => selectStatus(filter.value as StatusEvaluation | null)}
                    aria-pressed={registerFormsQuery.status === filter.value}
                    className="segmented-item"
                  >
                    {filter.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-64">
                <label htmlFor="register-form-search" className="sr-only">
                  ค้นหาด้วยชื่อจริง
                </label>
                <LuSearch
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-super-main-color/60"
                />
                <input
                  id="register-form-search"
                  type="search"
                  placeholder="ค้นหาด้วยชื่อจริง"
                  value={registerFormsQuery.firstName ?? ""}
                  onChange={(event) =>
                    setRegisterFormsQuery((prev) => ({
                      ...prev,
                      page: 1,
                      firstName: event.target.value,
                    }))
                  }
                  className="input pl-9"
                />
              </div>
              {userServer.role === "admin" && (
                <Select
                  label="อำเภอ"
                  placeholder="ทุกอำเภอ"
                  value={selectAumpure}
                  onChange={(amphure) => {
                    setselectAumpure(amphure);
                    setSelectTambon(null);
                    setRegisterFormsQuery((prev) => {
                      return {
                        ...prev,
                        page: 1,
                      };
                    });
                  }}
                  options={amphures.data}
                  getLabel={(amphure) => amphure.name_th}
                  getKey={(amphure) => amphure.id}
                  className="w-full sm:w-44"
                  loading={amphures.isLoading}
                  clearable
                />
              )}
              {tambons.data && (
                <Select
                  label="ตำบล"
                  placeholder="ทุกตำบล"
                  value={selectTambon}
                  loading={tambons.isLoading}
                  onChange={(tambon) => {
                    setSelectTambon(tambon);
                    setRegisterFormsQuery((prev) => ({ ...prev, page: 1 }));
                  }}
                  options={tambons.data}
                  getLabel={(tambon) => tambon.name_th}
                  getKey={(tambon) => tambon.id ?? tambon.name_th}
                  className="w-full sm:w-44"
                  clearable
                />
              )}
            </div>
          </div>

          <TableFarmer
            registerFormsQuery={registerFormsQuery}
            setRegisterFormsQuery={setRegisterFormsQuery}
            registerForms={registerForms}
          />

          {(registerForms.data?.meta.lastPage ?? 1) > 1 && (
            <div className="border-t border-third-color px-4 py-3 sm:px-5">
              <Pagination
                page={registerFormsQuery.page}
                pageCount={registerForms.data?.meta.lastPage ?? 1}
                onChange={(page) =>
                  setRegisterFormsQuery((prev) => ({ ...prev, page }))
                }
              />
            </div>
          )}
        </section>
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
