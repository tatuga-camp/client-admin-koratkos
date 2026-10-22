import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import React, { ReactNode, useState } from "react";
import { IconType } from "react-icons";
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
  DeleteFarmerService,
  GetFarmerKos01Service,
  GetFarmerKos02Service,
  GetFarmerKos03Service,
  GetFarmerKos04Service,
  GetFarmerKos05Service,
  GetFarmerService,
} from "../../../services/farmer";
import { useRouter } from "next/router";
import {
  LuArrowLeft,
  LuAward,
  LuCalendar,
  LuCreditCard,
  LuEye,
  LuEyeOff,
  LuFileDown,
  LuInbox,
  LuPhone,
  LuTrash2,
} from "react-icons/lu";
import moment from "moment";
import Image from "next/image";
import Head from "next/head";
import DashboardLayout from "../../../layouts/dashboardLayout";
import Swal from "sweetalert2";
import Link from "next/link";
import TableCertificate from "../../../components/tables/tableCertificate";
import { GetAllCertificateService } from "../../../services/certificate";
import CreateCertificate from "../../../components/forms/createCertificate";
import StatusBadge from "../../../components/ui/StatusBadge";

function MetaItem({
  icon: Icon,
  label,
  children,
}: {
  icon: IconType;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-third-color/60 text-super-main-color">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-super-main-color/70">
          {label}
        </dt>
        <dd className="flex min-h-5 items-center gap-1 break-words text-sm font-semibold">
          {children}
        </dd>
      </div>
    </div>
  );
}

function Index({ userServer }: { userServer: User }) {
  const [selectMenu, setSelectMenu] = useState<number>(0);
  const [triggerCreateCertificate, setTriggerCreateCertificate] =
    useState<boolean>(false);
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

  const certificates = useQuery({
    queryKey: ["certificates", router.query.farmerId],
    queryFn: () =>
      GetAllCertificateService({ farmerId: router.query.farmerId as string }),
  });

  const handleDeleteFarmer = async ({
    farmerId,
    name,
  }: {
    farmerId: string;
    name: string;
  }) => {
    let content = document.createElement("div");
    const replacedText = name.replace(/ /g, "_");
    content.innerHTML =
      "<div>กรุณาพิมพ์ข้อความนี้</div> <strong>" +
      replacedText +
      "</strong> <div>เพื่อลบเกษตรกร</div>";
    const { value } = await Swal.fire({
      title: "ยืนยันการลบเกษตรกร",
      input: "text",
      html: content,
      footer:
        "<strong>หากลบแล้วคุณจะไม่สามารถกู้คืนข้อมูลได้ และ ข้อมูลทุกอย่างที่เกี่ยวข้องกับเกษตรกรท่านนี้จะถูกลบทั้งหมด</strong>",
      showCancelButton: true,
      confirmButtonText: "ลบเกษตรกร",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
      inputValidator: (value) => {
        if (value !== replacedText) {
          return "กรุณาพิมพ์ข้อความยืนยันให้ถูกต้อง";
        }
      },
    });
    if (value) {
      try {
        Swal.fire({
          title: "กำลังลบข้อมูล",
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await DeleteFarmerService({ farmerId });
        router.push("/");
        Swal.fire("success", "ลบเกษตรกรสำเร็จ", "success");
      } catch (error: any) {
        Swal.fire("error", error.message.toString(), "error");
      }
    }
  };

  const kosDocuments = [kos01, kos02, kos03, kos04, kos05];
  const selectedDocument = kosDocuments[selectMenu];
  const selectedMenu = MenuFarmerEvaluation[selectMenu];

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = MenuFarmerEvaluation.length - 1;
    const nextIndex: Record<string, number> = {
      ArrowRight: selectMenu === last ? 0 : selectMenu + 1,
      ArrowLeft: selectMenu === 0 ? last : selectMenu - 1,
      Home: 0,
      End: last,
    };
    const next = nextIndex[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSelectMenu(next);
    document.getElementById(`kos-tab-${next}`)?.focus();
  };

  const fullName = farmer.data
    ? `${farmer.data.title ?? ""} ${farmer.data.firstName} ${farmer.data.lastName}`.trim()
    : "";
  const identityCardId = farmer.data?.identityCardId;
  const submittedDate = farmer.data?.register?.summitEvaluationDate;

  return (
    <DashboardLayout user={userServer}>
      <Head>
        <title>
          {fullName ? `${fullName} | Korat KOS` : "เกษตรกร | Korat KOS"}
        </title>
      </Head>
      {triggerCreateCertificate && (
        <CreateCertificate
          certificates={certificates}
          setTriggerCreateCertificate={setTriggerCreateCertificate}
        />
      )}
      <div className="flex flex-col gap-6">
        <div>
          <Link
            href="/"
            className="-mx-1 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-1 text-sm font-medium text-super-main-color/80
              hover:text-super-main-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color"
          >
            <LuArrowLeft aria-hidden="true" className="size-4" />
            กลับไปหน้ารายการคำขอ
          </Link>
        </div>

        {farmer.isError ? (
          <section className="card flex flex-col items-center gap-3 px-4 py-12 text-center">
            <p className="font-semibold">โหลดข้อมูลเกษตรกรไม่สำเร็จ</p>
            <button
              type="button"
              onClick={() => farmer.refetch()}
              className="btn btn-secondary"
            >
              ลองอีกครั้ง
            </button>
          </section>
        ) : (
          <section className="card" aria-busy={farmer.isLoading}>
            <div className="flex flex-col gap-5 p-4 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-third-color ring-2 ring-white sm:size-20">
                  {farmer.isLoading ? (
                    <span className="block size-full animate-pulse bg-third-color" />
                  ) : (
                    farmer.data?.picture && (
                      <Image
                        src={farmer.data.picture}
                        fill
                        sizes="80px"
                        className="object-cover"
                        alt=""
                      />
                    )
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-super-main-color/80">
                    ผู้รับการประเมิน
                  </p>
                  {farmer.isLoading ? (
                    <div className="mt-1 flex flex-col gap-2">
                      <div className="h-7 w-48 max-w-full animate-pulse rounded-md bg-third-color sm:w-64" />
                      <div className="h-5 w-28 animate-pulse rounded-full bg-third-color/70" />
                    </div>
                  ) : (
                    <>
                      <h1 className="break-words text-xl font-bold leading-tight sm:text-2xl">
                        {fullName}
                      </h1>
                      {farmer.data?.register && (
                        <StatusBadge
                          status={farmer.data.register.status}
                          className="mt-2"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:shrink-0 xl:justify-end">
                <Link
                  target="_blank"
                  href={`${router.query.farmerId}/report`}
                  className="btn btn-secondary"
                >
                  <LuFileDown aria-hidden="true" className="size-4" />
                  ดาวน์โหลดเอกสาร
                </Link>
                {userServer.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => setTriggerCreateCertificate((prev) => !prev)}
                    className="btn btn-dark"
                  >
                    <LuAward aria-hidden="true" className="size-4" />
                    สร้างใบรับรอง KOS
                  </button>
                )}
                <button
                  type="button"
                  disabled={!farmer.data}
                  onClick={() =>
                    handleDeleteFarmer({
                      farmerId: farmer.data?.id as string,
                      name: farmer.data?.firstName as string,
                    })
                  }
                  className="btn btn-danger-soft"
                >
                  <LuTrash2 aria-hidden="true" className="size-4" />
                  ลบเกษตรกร
                </button>
              </div>
            </div>

            <dl className="grid gap-4 border-t border-third-color px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
              <MetaItem icon={LuPhone} label="เบอร์โทร">
                {farmer.isLoading ? (
                  <span className="block h-4 w-24 animate-pulse rounded bg-third-color" />
                ) : (
                  <span className="tabular-nums">
                    {farmer.data?.phoneNumber || "-"}
                  </span>
                )}
              </MetaItem>
              <MetaItem icon={LuCreditCard} label="หมายเลขบัตรประชาชน">
                {farmer.isLoading ? (
                  <span className="block h-4 w-32 animate-pulse rounded bg-third-color" />
                ) : identityCardId ? (
                  <>
                    <span className="tabular-nums">
                      {triggerShowIdCard
                        ? identityCardId
                        : identityCardId.slice(0, -5) + "*****"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTriggerShowIdCard((prev) => !prev)}
                      aria-pressed={triggerShowIdCard}
                      aria-label={
                        triggerShowIdCard
                          ? "ซ่อนหมายเลขบัตรประชาชน"
                          : "แสดงหมายเลขบัตรประชาชน"
                      }
                      className="btn btn-ghost btn-icon -my-2.5"
                    >
                      {triggerShowIdCard ? (
                        <LuEyeOff aria-hidden="true" className="size-4" />
                      ) : (
                        <LuEye aria-hidden="true" className="size-4" />
                      )}
                    </button>
                  </>
                ) : (
                  "-"
                )}
              </MetaItem>
              <MetaItem icon={LuCalendar} label="วันที่ส่งคำขอ">
                {farmer.isLoading ? (
                  <span className="block h-4 w-24 animate-pulse rounded bg-third-color" />
                ) : submittedDate ? (
                  moment(submittedDate).locale("th").format("D MMM YYYY")
                ) : (
                  "-"
                )}
              </MetaItem>
            </dl>
          </section>
        )}

        {certificates.isLoading ? (
          <div className="card" aria-hidden="true">
            <div className="card-header">
              <div className="h-6 w-32 animate-pulse rounded-md bg-third-color" />
            </div>
            <div className="flex flex-col gap-3 p-4 sm:p-5">
              <div className="h-5 w-full animate-pulse rounded bg-third-color/70" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-third-color/70" />
            </div>
          </div>
        ) : (
          certificates.data &&
          certificates.data?.length > 0 && (
            <TableCertificate certificates={certificates} user={userServer} />
          )
        )}

        {farmer.isLoading ? (
          <div className="flex flex-col gap-4" aria-hidden="true">
            <div className="card flex gap-1.5 overflow-hidden p-1.5">
              {MenuFarmerEvaluation.map((menu) => (
                <div
                  key={menu.title}
                  className="h-14 min-w-36 flex-1 animate-pulse rounded-lg bg-third-color/60"
                />
              ))}
            </div>
            <div className="card h-80 animate-pulse bg-third-color/40" />
          </div>
        ) : farmer.data?.register ? (
          <div className="flex flex-col gap-4">
            <div className="card bg-third-color/30">
              <div
                role="tablist"
                aria-label="เอกสาร KOS"
                onKeyDown={handleTabKeyDown}
                className="flex snap-x scroll-px-1.5 gap-1.5 overflow-x-auto p-1.5"
              >
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
              </div>
            </div>

            {selectMenu === 5 ? (
              // KOS-06 lays out its own cards, so it is not wrapped in one.
              <div
                role="tabpanel"
                id="kos-tabpanel"
                aria-labelledby={`kos-tab-${selectMenu}`}
                className="min-w-0"
              >
                <Kos06Form />
              </div>
            ) : (
              <section
                role="tabpanel"
                id="kos-tabpanel"
                aria-labelledby={`kos-tab-${selectMenu}`}
                className="card min-w-0"
              >
                <div className="card-header">
                  <div className="min-w-0">
                    <h2 className="card-title">{selectedMenu.title}</h2>
                    <p className="text-sm text-super-main-color/80">
                      {selectedMenu.description}
                    </p>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  {selectedDocument?.isLoading ? (
                    <div
                      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                      aria-busy="true"
                    >
                      {[...new Array(6)].map((_, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <div className="h-3 w-24 animate-pulse rounded bg-third-color/70" />
                          <div className="h-5 w-full animate-pulse rounded bg-third-color" />
                        </div>
                      ))}
                    </div>
                  ) : selectedDocument?.isError ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                      <p className="font-semibold">โหลดเอกสารไม่สำเร็จ</p>
                      <button
                        type="button"
                        onClick={() => selectedDocument.refetch()}
                        className="btn btn-secondary"
                      >
                        ลองอีกครั้ง
                      </button>
                    </div>
                  ) : (
                    <>
                      {selectMenu === 0 && <Kos01Form kos01={kos01} />}
                      {selectMenu === 1 && <Kos02Form kos02={kos02} />}
                      {selectMenu === 2 && <Kos03Form kos03={kos03} />}
                      {selectMenu === 3 && <Kos04Form kos04={kos04} />}
                      {selectMenu === 4 && <Kos05Form kos05={kos05} />}
                    </>
                  )}
                </div>
              </section>
            )}
          </div>
        ) : (
          farmer.data && (
            <section className="card flex flex-col items-center gap-2 px-4 py-12 text-center">
              <LuInbox
                aria-hidden="true"
                className="size-10 text-fifth-color"
              />
              <p className="font-semibold">เกษตรกรยังไม่ได้ส่งคำขอประเมิน</p>
            </section>
          )
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
