import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import { LuShieldCheck, LuUserCog } from "react-icons/lu";
import { GetUserService } from "../../services/user";
import DashboardLayout from "../../layouts/dashboardLayout";
import { User } from "../../model";
import { useQuery } from "@tanstack/react-query";
import { menuAccountSetting } from "../../data/menus";
import GeneralData from "../../components/accounts/generalData";
import SecurityData from "../../components/accounts/securityData";
import PageHeader from "../../components/ui/PageHeader";

// Lucide icons for the menu entries, in the same order as menuAccountSetting.
const menuIcons = [LuUserCog, LuShieldCheck];

function Setting({ userServer }: { userServer: User }) {
  const [selectMenu, setSelectMenu] = useState<number>(0);
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUserService({}),
    initialData: userServer,
  });
  return (
    <DashboardLayout user={user.data}>
      <Head>
        <title>ตั้งค่าบัญชีผู้ใช้ | Korat KOS</title>
      </Head>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="ตั้งค่าบัญชีผู้ใช้"
          description="แก้ไขข้อมูลส่วนตัว รูปโปรไฟล์ และรหัสผ่านสำหรับเข้าสู่ระบบ"
        />

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="segmented" role="group" aria-label="หมวดการตั้งค่า">
            {menuAccountSetting().map((menu, index) => {
              const Icon = menuIcons[index] ?? menu.icon;
              return (
                <button
                  type="button"
                  key={menu.title}
                  onClick={() => setSelectMenu(() => index)}
                  aria-pressed={selectMenu === index}
                  className="segmented-item"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {menu.title}
                </button>
              );
            })}
          </div>
        </div>

        {selectMenu === 0 && <GeneralData user={user} />}
        {selectMenu === 1 && <SecurityData user={user} />}
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
