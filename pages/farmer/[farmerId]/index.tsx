import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import { GetUserService } from "../../../services/user";
import { User } from "../../../model";
import { MenuFarmerEvaluation } from "../../../data/menus";
import MenuCardEvaluationFarmer from "../../../components/cards/menuCardEvaluationFarmer";
import Kos01Form from "../../../components/forms/kos01Form";
import Kos02Form from "../../../components/forms/kos02Form";
import Kos03Form from "../../../components/forms/kos03Form";
import Kos04Form from "../../../components/forms/kos04Form";
import Kos06Form from "../../../components/forms/kos06Form";
import Kos05Form from "../../../components/forms/kos05Form";
import { useQuery } from "@tanstack/react-query";
import {
  GetFarmerKos01Service,
  GetFarmerKos02Service,
  GetFarmerKos03Service,
  GetFarmerKos04Service,
  GetFarmerKos05Service,
  GetFarmerService,
} from "../../../services/farmer";
import { useRouter } from "next/router";
import {
  FaAddressCard,
  FaFileDownload,
  FaPhoneSquare,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";
import moment from "moment";
import Image from "next/image";
import Head from "next/head";
import DashboardLayout from "../../../layouts/dashboardLayout";
import Swal from "sweetalert2";
import { DowloadPDFService } from "../../../services/dowloadFile";

function Index({ userServer }: { userServer: User }) {
  const [selectMenu, setSelectMenu] = useState<number>(0);
  const [triggerShowIdCard, setTriggerShowIdCard] = useState<boolean>(false);
  const router = useRouter();
  const kos01 = useQuery({
    queryKey: ["kos01", router.query.farmerId],
    queryFn: () =>
      GetFarmerKos01Service({ farmerId: router.query.farmerId as string }),
  });

  const kos02 = useQuery({
    queryKey: ["kos02", router.query.farmerId],
    queryFn: () =>
      GetFarmerKos02Service({ farmerId: router.query.farmerId as string }),
  });
  const kos03 = useQuery({
    queryKey: ["kos03", router.query.farmerId],
    queryFn: () =>
      GetFarmerKos03Service({ farmerId: router.query.farmerId as string }),
  });
  const kos04 = useQuery({
    queryKey: ["kos04", router.query.farmerId],
    queryFn: () =>
      GetFarmerKos04Service({ farmerId: router.query.farmerId as string }),
  });

  const kos05 = useQuery({
    queryKey: ["kos05", router.query.farmerId],
    queryFn: () =>
      GetFarmerKos05Service({ farmerId: router.query.farmerId as string }),
  });

  const farmer = useQuery({
    queryKey: ["farmer", router.query.farmerId],
    queryFn: () =>
      GetFarmerService({ farmerId: router.query.farmerId as string }),
  });

  const handleDownloadPDF = async () => {
    try {
      Swal.fire({
        icon: "info",
        title: "กำลังดาวโหลดเอกสาร",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const download = await DowloadPDFService({
        farmerId: router.query.farmerId as string,
      });

      Swal.fire({
        icon: "success",
        title: "ดาวโหลดเอกสารสำเร็จ",
        text: "เอกสารได้ถูกดาวโหลดเรียบร้อยแล้ว",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    }
  };
  return (
    <DashboardLayout user={userServer}>
      <Head>
        <title>เกษตรกร</title>
      </Head>
      <div className="mt-10 flex w-full flex-col items-center justify-start gap-5">
        <header className="flex w-full flex-col items-center gap-5">
          <div className="flex h-max w-11/12 justify-between rounded-lg bg-fourth-color p-5">
            <div className="flex w-96 flex-col items-start justify-center">
              <h1 className="text-2xl font-semibold text-super-main-color">
                ผู้รับการประเมิน :
              </h1>
              {farmer.isLoading ? (
                <div className="h-5 w-40 animate-pulse rounded-lg bg-gray-200"></div>
              ) : (
                <h2 className="text-2xl font-bold text-super-main-color">
                  {farmer.data?.title} {farmer.data?.firstName}{" "}
                  {farmer.data?.lastName}
                </h2>
              )}

              <h4 className="flex w-full items-center justify-start gap-2 text-fifth-color">
                <FaPhoneSquare />
                <span className="text-base font-semibold">เบอร์โทร</span>
                {farmer.isLoading ? (
                  <div className="h-5 w-20 animate-pulse rounded-lg bg-gray-100"></div>
                ) : (
                  <span>{farmer.data?.phoneNumber}</span>
                )}
              </h4>
              <h4 className="flex w-full items-center justify-start gap-2 text-fifth-color">
                <FaAddressCard />

                <span className="text-base font-semibold">
                  หมายเลขบัตรประชาชน
                </span>
                {farmer.isLoading ? (
                  <div className="flex items-center justify-start gap-2">
                    <div className="h-5 w-5 animate-pulse rounded-full bg-gray-300"></div>
                    <div className="h-5 w-20 animate-pulse rounded-lg bg-gray-100"></div>
                  </div>
                ) : (
                  <span>
                    {triggerShowIdCard
                      ? farmer.data?.identityCardId
                      : farmer.data?.identityCardId?.slice(0, -5) + "*****"}
                  </span>
                )}
                {triggerShowIdCard ? (
                  <FaRegEye
                    onClick={() => setTriggerShowIdCard(() => false)}
                    className="cursor-pointer rounded-full bg-white text-xl"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => setTriggerShowIdCard(() => true)}
                    className="cursor-pointer rounded-full bg-white text-xl"
                  />
                )}
              </h4>
              <button
                onClick={handleDownloadPDF}
                className="button-focus flex items-center justify-center gap-2 rounded-lg bg-fifth-color px-5 py-1 text-white"
              >
                ดาวโหลดเอกสาร <FaFileDownload />
              </button>
            </div>
            <div className="flex w-max flex-col items-end justify-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                {farmer.isLoading ? (
                  <div className="h-full w-full animate-pulse bg-gray-500"></div>
                ) : (
                  <Image
                    src={farmer.data?.picture as string}
                    fill
                    className="object-cover"
                    alt="profile"
                  />
                )}
              </div>
              <h1 className="text-sm font-semibold text-super-main-color">
                วันที่ส่งคำขอ :
              </h1>
              {farmer.isLoading ? (
                <div className="h-5 w-20 animate-pulse rounded-lg bg-gray-100"></div>
              ) : (
                <h2 className="text-sm font-bold text-super-main-color">
                  {moment(farmer.data?.register?.summitEvaluationDate).format(
                    "DD/MMMM/YYYY",
                  )}
                </h2>
              )}
            </div>
          </div>

          {farmer.data?.register && (
            <nav className="grid h-40 w-11/12 grid-cols-6 place-items-center gap-3">
              {MenuFarmerEvaluation.map((menu, index) => {
                return (
                  <MenuCardEvaluationFarmer
                    selectMenu={selectMenu}
                    setSelectMenu={setSelectMenu}
                    index={index}
                    card={menu}
                    key={index}
                  />
                );
              })}
            </nav>
          )}
        </header>

        {farmer.data?.register ? (
          <main className="w-full">
            {kos01.isLoading ? (
              <div className=" grid h-96 w-11/12 animate-pulse grid-cols-3 gap-5 rounded-lg bg-gray-50 p-5">
                {[...new Array(5)].map((_, index) => {
                  return (
                    <div
                      className="h-full w-full animate-pulse rounded-lg bg-slate-200"
                      key={index}
                    ></div>
                  );
                })}
              </div>
            ) : (
              <div className="flex w-full items-center justify-center">
                {selectMenu === 0 && <Kos01Form kos01={kos01} />}
                {selectMenu === 1 && <Kos02Form kos02={kos02} />}
                {selectMenu === 2 && <Kos03Form kos03={kos03} />}
                {selectMenu === 3 && <Kos04Form kos04={kos04} />}
                {selectMenu === 4 && <Kos05Form kos05={kos05} />}
                {selectMenu === 5 && <Kos06Form />}
              </div>
            )}
          </main>
        ) : (
          <main className="text-lg font-semibold">
            เกษตรกรยังไม่ได้ส่งคำขอประเมิน
          </main>
        )}
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
