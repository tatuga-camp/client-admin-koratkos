import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { DowloadHTMLService } from "../../../services/dowloadFile";
import { parseCookies } from "nookies";
import Swal from "sweetalert2";
import Error404 from "../../../components/svgs/404";
import Link from "next/link";
import { useRouter } from "next/router";

function Report({
  html,
  error,
}: {
  html: string;
  error?: { message: string; error: string; statusCode: number };
}) {
  const router = useRouter();
  useEffect(() => {
    if (!error) {
      window.print();
    }
  }, []);

  if (error) {
    return (
      <div
        className="flex  h-screen w-screen flex-col items-center justify-center gap-5 font-Anuphan
     font-semibold text-super-main-color"
      >
        <div className="flex h-20 w-20 items-center justify-center">
          <Error404 />
        </div>
        <h1 className="text-3xl font-bold">เกิดข้อผิดพลาด</h1>
        <span className="text-xl">{error.message}</span>
        <Link
          href={`/farmer/${router.query.farmerId}`}
          className="rounded-lg bg-super-main-color px-5 py-3 text-lg
        font-semibold text-white drop-shadow-md transition-all duration-150 hover:scale-105 active:scale-110"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default Report;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  try {
    const query = ctx.query;
    const cookies = parseCookies(ctx);
    const accessToken = cookies.access_token;
    const html = await DowloadHTMLService({
      farmerId: query.farmerId as string,
      access_token: accessToken,
    });
    return {
      props: {
        html,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error,
      },
    };
  }
};
