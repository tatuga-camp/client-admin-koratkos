import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import { GetUserService } from "../../services/user";
import DashboardLayout from "../../layouts/dashboardLayout";
import { User } from "../../model";
import { useQuery } from "@tanstack/react-query";
import { menuAccountSetting } from "../../data/menus";
import GeneralData from "../../components/accounts/generalData";
import SecurityData from "../../components/accounts/securityData";

function Setting({ userServer }: { userServer: User }) {
  const [selectMenu, setSelectMenu] = useState<number>(0);
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUserService({}),
    initialData: userServer,
  });
  return (
    <DashboardLayout user={user.data}>
      <div className="mt-20 flex w-full flex-col items-center font-Anuphan">
        <header className="flex w-11/12 justify-start border-b-4 border-[#C6A969] pb-5">
          <h1 className="text-4xl font-extrabold text-super-main-color">
            ตั้งค่าบัญชีผู้ใช้
          </h1>
        </header>
        <main className="mt-5 flex w-11/12 flex-col gap-10">
          <nav className="flex items-center justify-start gap-5">
            {menuAccountSetting().map((menu, index) => {
              return (
                <button
                  onClick={() => setSelectMenu(() => index)}
                  className={`flex w-max items-center justify-center gap-2 rounded-xl transition
                    duration-100 hover:scale-105 active:scale-110
                 ${selectMenu === index ? "bg-[#C6A969]" : "bg-gray-400"} px-4 py-1 text-lg font-semibold text-white`}
                >
                  <menu.icon /> {menu.title}
                </button>
              );
            })}
          </nav>
          {selectMenu === 0 && <GeneralData user={user} />}
          {selectMenu === 1 && <SecurityData user={user} />}
        </main>
      </div>
    </DashboardLayout>
  );
}

export default Setting;

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
