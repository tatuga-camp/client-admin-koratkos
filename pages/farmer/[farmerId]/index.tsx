import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import { GetUserService } from "../../../services/user";
import { User } from "../../../model";
import DashboardLayout from "../../../layouts/dashboardLayout";
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
  GetFarmerService,
} from "../../../services/farmer";
import { useRouter } from "next/router";
import {
  FaAddressCard,
  FaPhoneSquare,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";
import moment from "moment";
import Image from "next/image";

function Index({ userServer }: { userServer: User }) {
  const [selectMenu, setSelectMenu] = useState<number>(0);
  const [triggerShowIdCard, setTriggerShowIdCard] = useState<boolean>(false);
  const router = useRouter();
  const kos01 = useQuery({
    queryKey: ["kos01", router.query.farmerId],
    queryFn: () =>
      GetFarmerKos01Service({ farmerId: router.query.farmerId as string }),
  });
  const farmer = useQuery({
    queryKey: ["farmer", router.query.farmerId],
    queryFn: () =>
      GetFarmerService({ farmerId: router.query.farmerId as string }),
  });
  return (
    <DashboardLayout user={userServer}>
      <div className="mt-10 flex w-full flex-col items-center justify-start gap-5">
        <header className="flex w-full flex-col items-center gap-5">
          <div className="flex h-40 w-11/12 justify-between rounded-lg bg-fourth-color p-5">
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

              <h4 className="text-fifth-color flex w-full items-center justify-start gap-2">
                <FaPhoneSquare />
                <span className="text-base font-semibold">เบอร์โทร</span>
                {farmer.isLoading ? (
                  <div className="h-5 w-20 animate-pulse rounded-lg bg-gray-100"></div>
                ) : (
                  <span>{farmer.data?.phoneNumber}</span>
                )}
              </h4>
              <h4 className="text-fifth-color flex w-full items-center justify-start gap-2">
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
                  {moment(farmer.data?.register.summitEvaluationDate).format(
                    "DD/MMMM/YYYY",
                  )}
                </h2>
              )}
            </div>
          </div>
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
        </header>
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
          <main className="flex w-full items-center justify-center">
            {selectMenu === 0 && <Kos01Form kos01={kos01} />}
            {selectMenu === 1 && <Kos02Form />}
            {selectMenu === 2 && <Kos03Form />}
            {selectMenu === 3 && <Kos04Form />}
            {selectMenu === 4 && <Kos05Form />}
            {selectMenu === 5 && <Kos06Form />}
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
