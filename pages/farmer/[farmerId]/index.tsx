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

function Index({ userServer }: { userServer: User }) {
  const [selectMenu, setSelectMenu] = useState<number>(0);
  return (
    <DashboardLayout user={userServer}>
      <div className="mt-10 flex w-full flex-col items-center justify-start gap-5">
        <header className="grid h-40 w-11/12 grid-cols-6 place-items-center gap-3">
          {MenuFarmerEvaluation.map((menu, index) => {
            return (
              <MenuCardEvaluationFarmer
                setSelectMenu={setSelectMenu}
                index={index}
                card={menu}
                key={index}
              />
            );
          })}
        </header>
        <main>
          {selectMenu === 0 && <Kos01Form />}
          {selectMenu === 1 && <Kos02Form />}
          {selectMenu === 2 && <Kos03Form />}
          {selectMenu === 3 && <Kos04Form />}
          {selectMenu === 4 && <Kos05Form />}
          {selectMenu === 5 && <Kos06Form />}
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
