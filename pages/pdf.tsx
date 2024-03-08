import React from "react";
const farmer = {
  id: "65cf75c67ea2fa2fe39cc76a",
  title: "นาง",
  firstName: "อายรียา",
  lastName: "ชาดำ",
  identityCardId: "1309902663520",
  phoneNumber: "0917917848",
  picture:
    "https://storage.googleapis.com/development-koratkos/farmerId:65cf75c67ea2fa2fe39cc76a/UUID:5a6c1087-59e3-4f7b-b40c-6d588fdd17a1/Screenshot_20240215-195422_LINE.jpg",
  isDeleted: false,
};

const kos1 = {
  id: "65cf78487ea2fa2fe39cc76f",

  address: "79",
  villageNumber: "8",
  subdistrict: "ครบุรี",
  district: "ครบุรี",
  province: "นครราชสีมา",
  phoneNumber: "0917917848",
  farmerId: "65cf75c67ea2fa2fe39cc76a",
  farmKos1: {
    id: "65cf78487ea2fa2fe39cc770",
    address: "79",
    villageNumber: "8",
    subdistrict: "ครบุรี",
    district: "ครบุรี",
    province: "นครราชสีมา",
    latitude: "14.7546757",
    longitude: "160.76676",
    mapTerrain:
      "https://storage.googleapis.com/development-koratkos/farmerId:65cf75c67ea2fa2fe39cc76a/UUID:ec516a89-8275-4379-a322-bae7e13fb600/static-map",
    mapHybrid:
      "https://storage.googleapis.com/development-koratkos/farmerId:65cf75c67ea2fa2fe39cc76a/UUID:c621e09b-6683-48fc-a52b-39b0d1ffeeaf/static-map",
    certRequestDate: "2024-02-15T17:00:00.000Z",
    productionProcess: ["มีเฉพาะผลิตผลพืช อินทรีย์เท่านั้น"],
    productionMethod: "ชนิดพืชที่ผลิตแตกต่างกัน",
    plotsTotal: 6,
    raiTotal: 4,
    nganTotal: 2,
    certicatedPlotTotal: 2,
    certicatedRaiTotal: 2,
    certicatedNganTotal: 2,
    moreInfo: null,
    docKos01Id: "65cf78487ea2fa2fe39cc76f",
    farmerId: "65cf75c67ea2fa2fe39cc76a",
  },
  plantKOS1s: [
    {
      id: "65cf7a017ea2fa2fe39cc777",

      plant: "ถั่วงอก",
      raiTotal: 4,
      annualProdCycles: 6,
      seasonProd: [Array],
      expHarvestDate: "2024-06-13T17:00:00.000Z",
      expYieldAmt: 60,
      farmKOS1Id: "65cf78487ea2fa2fe39cc770",
      farmerId: "65cf75c67ea2fa2fe39cc76a",
    },
  ],
};
function Pdf() {
  return (
    <div className="br flex h-screen w-screen flex-col items-center bg-white font-Anuphan ">
      <header className="flex w-11/12 flex-col items-center justify-center p-5">
        <h2 className="flex w-full justify-end bg-slate-200 text-right text-lg font-semibold text-gray-600">
          KOS-02
        </h2>
        <h1 className="w-11/12 text-balance text-center text-lg font-semibold text-green-950">
          ใบสมัครขอรับการตรวจประเมินมาตรฐาน
          <br />
          เกษตรอินทรีย์ขั้นพื้นฐาน จังหวัดนครราชสีมา
          <br />
          (Korat Organic Standard: KOS)
        </h1>
      </header>
      <main className="flex w-11/12 flex-col items-start justify-start gap-5 p-5 text-sm">
        <section className="flex flex-col items-start justify-start gap-2">
          <span className="font-semibold">
            1. ชื่อ นามสกุลผู้ขอการรับรอง:{" "}
            <span className="w-96 font-normal underline decoration-dotted">
              นายเพิ่มลาภ โพธิ์หล้า
            </span>
          </span>
          <span className="font-semibold">
            เลขประจำตัวประชาชน:{" "}
            <span className="w-96 font-normal underline decoration-dotted">
              13099-02728-6-99
            </span>
          </span>
          <span className="font-semibold">
            ที่อยู่เลขที่{" "}
            <span className="w-96 font-normal underline decoration-dotted">
              237/23
            </span>
            <span className="font-semibold">
              หมู่ที่{" "}
              <span className="w-96 font-normal underline decoration-dotted">
                9{" "}
              </span>
              <span className="font-semibold">
                ตำบล{" "}
                <span className="w-96 font-normal underline decoration-dotted">
                  โพธิ์กลาง
                </span>{" "}
              </span>
              <span className="font-semibold">
                อำเภอ{" "}
                <span className="w-96 font-normal underline decoration-dotted">
                  เมืองนครราชสีมา
                </span>{" "}
              </span>
            </span>
          </span>
          <span className="font-semibold">
            จังหวัด{" "}
            <span className="w-96 font-normal underline decoration-dotted">
              จังหวัดนครราชสีมา
            </span>
            <span className="font-semibold">
              โทรศัพท์{" "}
              <span className="w-96 font-normal underline decoration-dotted">
                061-0277-960{" "}
              </span>{" "}
            </span>
          </span>
        </section>
        <section className="flex flex-col items-start justify-start gap-2">
          <span className="font-semibold">
            2. ที่ตั้งสถานที่ผลิตพืชอินทรีย์
          </span>
          <span className="font-semibold">
            ที่อยู่เลขที่{" "}
            <span className="w-96 font-normal underline decoration-dotted">
              237/23
            </span>
            <span className="font-semibold">
              หมู่ที่{" "}
              <span className="w-96 font-normal underline decoration-dotted">
                9{" "}
              </span>
              <span className="font-semibold">
                ตำบล{" "}
                <span className="w-96 font-normal underline decoration-dotted">
                  โพธิ์กลาง
                </span>{" "}
              </span>
              <span className="font-semibold">
                อำเภอ{" "}
                <span className="w-96 font-normal underline decoration-dotted">
                  เมืองนครราชสีมา
                </span>{" "}
              </span>
            </span>
          </span>
          <span className="font-semibold">
            จังหวัด{" "}
            <span className="w-96 font-normal underline decoration-dotted">
              จังหวัดนครราชสีมา
            </span>
          </span>
          <span className="font-semibold">
            พิกัดแปลง (UTM) 47/48{" "}
            <span className="w-96 font-normal">
              <span className="font-semibold">
                {" "}
                X :
                <span className="w-96 font-normal underline decoration-dotted">
                  13.554565
                </span>
                <span className="font-semibold">
                  {" "}
                  Y :
                  <span className="w-96 font-normal underline decoration-dotted">
                    14.556554
                  </span>
                </span>
              </span>
            </span>
          </span>
          <div className=" min-w grid h-max w-full grid-cols-3 justify-center gap-2 ">
            <img
              className=" col-span-1 ring-1 ring-black"
              style={{
                display: "block",

                width: "150px",
                height: "150px",
                objectFit: "contain",
              }}
              src="https://etest.nrru.ac.th/eteacher/img/nrruland.png"
            />
            <img
              className=" ring-1 ring-black"
              style={{
                display: "block",

                width: "150px",
                height: "150px",
                objectFit: "contain",
              }}
              src="https://etest.nrru.ac.th/eteacher/img/nrruland.png"
            />
          </div>
        </section>
        <section className="flex flex-col items-start justify-start gap-2">
          <span className="font-semibold">
            3. วันที่ขอการรับรอง{" "}
            <span className="w-96 font-normal underline decoration-dotted">
              {" "}
              23/ธันวาคม/2567
            </span>
          </span>
        </section>
        <section className="flex flex-col items-start justify-start gap-2">
          <span className="font-semibold">4. กระบวนการผลิต</span>
          <span className="flex gap-2 ">
            <span className="underline decoration-dotted">
              มีเฉพาะผลิตผลพืชอิทรีย์เท่านั้น
            </span>
            <span>
              <span className="font-semibold"> วิธีการผลิด </span>
              <span className="underline decoration-dotted">
                เวลาการผลิตแตกต่างกัน
              </span>
            </span>
          </span>
        </section>
        <section className="flex flex-col items-start justify-start gap-2">
          <span className="font-semibold">5. ชนิดพืชที่ขอการรับลอง</span>
          <div className="flex gap-1">
            <span className="font-semibold">จำนวนแปลงทั้งหมด</span>
            <span className="flex gap-2 ">
              <span className="underline decoration-dotted">20 แปลง</span>
              <span>
                <span className="font-semibold"> พื้นที่ </span>
                <span className="underline decoration-dotted">50 ไร่</span>
              </span>
              <span>
                <span className="underline decoration-dotted">40 งาน</span>
              </span>
            </span>
          </div>
          <div className="flex gap-1">
            <span className="font-semibold">จำนวนแปลงที่ขอรับรอง KOS</span>
            <span className="flex gap-2 ">
              <span className="underline decoration-dotted">20 แปลง</span>
              <span>
                <span className="font-semibold"> พื้นที่ </span>
                <span className="underline decoration-dotted">50 ไร่</span>
              </span>
              <span>
                <span className="underline decoration-dotted">40 งาน</span>
              </span>
            </span>
          </div>
        </section>

        <table className="table-auto border-separate">
          <thead>
            <tr className="">
              <td className="h-10  w-60 bg-gray-300  text-center text-xs">
                ชนิทพืช
              </td>
              <td className="h-10  w-40 bg-gray-300  text-center text-xs">
                พื้นที่ (ไร่)
              </td>
              <td className="h-10  w-40 bg-gray-300  text-center text-xs">
                จำนวนรอบการผลิต/ปี
              </td>
              <td className="h-10  w-40 bg-gray-300  text-center text-xs">
                ช่วงเวลาการผลิต (ระบุเดือน)
              </td>
              <td className="h-10  w-40 bg-gray-300  text-center text-xs">
                วันที่คาดว่าจะเก็บเกี่ยว
              </td>
              <td className="h-10  w-40 bg-gray-300  text-center text-xs">
                ปริมาณผลผลิตที่คาดว่าจะได้รับ (กก.)
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="h-10 bg-slate-200 text-xs">
              <td className="text-center">กล้วยป่าไม้</td>
              <td className="text-center">4,000</td>
              <td className="text-center">2</td>
              <td className="text-center">กุมภาพัธ์ - ตุลาคม</td>
              <td className="text-center">30 กุมภาพันธ์ 2567</td>
              <td className="text-center">3,000</td>
            </tr>
            <tr className="h-10 bg-slate-200 text-xs">
              <td className="text-center">กล้วยป่าไม้</td>
              <td className="text-center">4,000</td>
              <td className="text-center">2</td>
              <td className="text-center">กุมภาพัธ์ - ตุลาคม</td>
              <td className="text-center">30 กุมภาพันธ์ 2567</td>
              <td className="text-center">3,000</td>
            </tr>
            <tr className="h-10 bg-slate-200 text-xs">
              <td className="text-center">กล้วยป่าไม้</td>
              <td className="text-center">4,000</td>
              <td className="text-center">2</td>
              <td className="text-center">กุมภาพัธ์ - ตุลาคม</td>
              <td className="text-center">30 กุมภาพันธ์ 2567</td>
              <td className="text-center">3,000</td>
            </tr>
            <tr className="h-10 bg-slate-200 text-xs">
              <td className="text-center">กล้วยป่าไม้</td>
              <td className="text-center">4,000</td>
              <td className="text-center">2</td>
              <td className="text-center">กุมภาพัธ์ - ตุลาคม</td>
              <td className="text-center">30 กุมภาพันธ์ 2567</td>
              <td className="text-center">3,000</td>
            </tr>
            <tr className="h-10 bg-slate-200 text-xs">
              <td className="text-center">กล้วยป่าไม้</td>
              <td className="text-center">4,000</td>
              <td className="text-center">2</td>
              <td className="text-center">กุมภาพัธ์ - ตุลาคม</td>
              <td className="text-center">30 กุมภาพันธ์ 2567</td>
              <td className="text-center">3,000</td>
            </tr>
            <tr className="h-10 bg-slate-200 text-xs">
              <td className="text-center">กล้วยป่าไม้</td>
              <td className="text-center">4,000</td>
              <td className="text-center">2</td>
              <td className="text-center">กุมภาพัธ์ - ตุลาคม</td>
              <td className="text-center">30 กุมภาพันธ์ 2567</td>
              <td className="grid grid-cols-2 text-center">3,000</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Pdf;
