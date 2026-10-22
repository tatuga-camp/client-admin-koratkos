import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import React from "react";
import { GetUserService } from "../../services/user";
import DashboardLayout from "../../layouts/dashboardLayout";
import { User } from "../../model";
import { useQuery } from "@tanstack/react-query";
import { GetAllUserService } from "../../services/admin";
import TableUsers from "../../components/tables/tableUsers";
import Head from "next/head";
import TableUserCreateKey from "../../components/tables/tableUserCreateKey";
import { GetAllUserCreateKeyService } from "../../services/userCreateKey";
import PageHeader from "../../components/ui/PageHeader";

function Index({ userServer }: { userServer: User }) {
  const users = useQuery({
    queryKey: ["users"],
    queryFn: () => GetAllUserService(),
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 10,
  });
  const userCreateKeys = useQuery({
    queryKey: ["userCreateKeys"],
    queryFn: () => GetAllUserCreateKeyService(),
  });

  return (
    <DashboardLayout user={userServer}>
      <Head>
        <title>ผู้ดูแลระบบ | Korat KOS</title>
      </Head>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="ผู้ดูแลระบบ"
          description="จัดการรหัสสำหรับลงทะเบียนและบัญชีผู้ประเมินในระบบ"
        />

        <section aria-labelledby="user-create-keys-title" className="card">
          <div className="card-header">
            <div className="min-w-0">
              <h2 id="user-create-keys-title" className="card-title">
                รหัสสำหรับลงทะเบียน
              </h2>
              <p className="text-sm text-super-main-color/80">
                ส่งรหัสให้ผู้ประเมินใช้ตอนลงทะเบียน รหัสจะกำหนดหน้าที่และหน่วยงานของบัญชี
              </p>
            </div>
          </div>
          <TableUserCreateKey userCreateKeys={userCreateKeys} />
        </section>

        <section aria-labelledby="users-title" className="card">
          <div className="card-header">
            <div className="min-w-0">
              <h2 id="users-title" className="card-title">
                บัญชีผู้ประเมิน
              </h2>
              <p className="text-sm text-super-main-color/80">
                ปิดหรือเปิดการใช้งานบัญชี และเข้าสู่ระบบแทนผู้ประเมินเพื่อตรวจสอบปัญหา
              </p>
            </div>
          </div>
          <TableUsers users={users} />
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
      if (userServer.role !== "admin") {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
        };
      }
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
