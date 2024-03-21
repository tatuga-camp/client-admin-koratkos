import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import React, { useEffect } from "react";
import {
  GetCertificateService,
  ResponseGetCertificateService,
} from "../../../../services/certificate";
import moment from "moment";

function Certificate({
  certificate,
}: {
  certificate: ResponseGetCertificateService;
}) {
  useEffect(() => {
    window.print();
  }, []);
  return (
    <div className="flex h-screen w-screen break-after-avoid items-center justify-center border-4 border-orange-600 bg-transparent font-Anuphan ">
      <main
        className="relative flex h-[99%] w-[99%] flex-col items-center
       justify-between gap-3 border-2 border-orange-600 py-5"
      >
        <Image
          src="/favicon.ico"
          width={500}
          height={500}
          priority
          className="absolute bottom-0 left-0 right-0 top-0 -z-10 m-auto object-cover  opacity-10"
          alt="logo cover"
        />
        <div className="mt-5 flex gap-5">
          <div className="relative h-20 w-20 overflow-hidden rounded-full ">
            <Image
              priority
              src="https://storage.googleapis.com/koratkos-stroage/public/korat-logo-full.png"
              fill
              className="object-cover "
              alt="image logo"
            />
          </div>
          <div className="relative h-20 w-20 overflow-hidden rounded-full ">
            <Image
              priority
              src="/favicon.ico"
              fill
              className="object-cover "
              alt="image logo"
            />
          </div>
        </div>
        <h1 className="text-2xl font-semibold">จังหวัดนครราชสีมา</h1>
        <h2 className="text-2xl">ใบรับรองฉบับนี้ให้ไว้เพื่อแสดงว่า</h2>
        <h2 className="text-2xl font-semibold">
          {certificate.farmer.title}
          {certificate.farmer.firstName} {certificate.farmer.lastName}
        </h2>
        <h3 className="max-w-3xl break-words text-center text-xl ">
          ที่อยู่{" "}
          <span>
            {certificate.address} หมู่ที่ {certificate.villageNumber} ตำบล
            {certificate.subdistrict} อำเภอ{certificate.district} จังหวัด
            {certificate.province}
          </span>
        </h3>
        <div className="mt-5 text-center text-xl font-semibold">
          ได้รับการรับรองมาตรฐานเกษตรอินทรีย์ขั้นพื้นฐานจังหวัดนครราชสีมา
          <h1 className="text-xl font-semibold">
            Korat Organic Standard : KOS
          </h1>
        </div>
        <h1 className="my-3 text-2xl font-semibold">
          รหัสรับรอง {certificate.certNumber}
        </h1>
        <h3 className="max-w-3xl break-words text-center text-xl ">
          ที่ตั้งแปลง หมู่ที่ {certificate.farmVillageNumber} ตำบล
          {certificate.farmSubdistrict} อำเภอ
          {certificate.farmDistrict} จังหวัด{certificate.farmProvince}
        </h3>
        <div className="flex w-full items-center justify-center gap-3 ">
          <h3>พิกัด lat: {certificate.latitude}</h3>
          <h3>long: {certificate.longitude} </h3>
        </div>
        <div className="flex w-full items-center justify-center gap-3 ">
          <h3>พื้นที่รวม {certificate.totalRai.toLocaleString()} ไร่ </h3>
          <h3>จำนวน {certificate.totalPlant} ชนิดพืช</h3>
        </div>
        <h3 className="max-w-3xl break-words text-center text-xl font-semibold ">
          {certificate.plantType.map((plant, index) => `${plant}`).join(", ")}
        </h3>
        <div className="flex w-full items-center justify-center gap-3 text-xl ">
          <h3>
            วันที่รับรอง{" "}
            {new Date(certificate.certRequestDate).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </h3>
          <h3>
            วันที่หมดอายุ{" "}
            {new Date(certificate.certExpiredDate).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
          </h3>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-1 text-xl ">
          <div className="relative h-36 w-60">
            <Image
              priority
              src={certificate.governorSignature}
              fill
              className="object-cover "
              alt="image logo"
            />
          </div>
          <h3>({certificate.governorName})</h3>
          <h3>ผู้ว่าราชการจังหวัดนครราชสีมา</h3>
        </div>
      </main>
    </div>
  );
}

export default Certificate;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  try {
    const query = ctx.query;
    const certificate = await GetCertificateService({
      certificateId: query.certificateId as string,
    });
    return {
      props: {
        certificate,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
