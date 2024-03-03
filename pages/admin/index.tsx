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
        <title>Admin Dashboard</title>
      </Head>
      <div className="mt-10 flex w-full flex-col items-center justify-start gap-5 xl:w-[58rem] 2xl:w-[65rem] ">
        <TableUserCreateKey userCreateKeys={userCreateKeys} />
        <TableUsers users={users} />
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
