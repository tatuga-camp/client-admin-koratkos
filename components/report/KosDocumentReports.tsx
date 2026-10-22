import React from "react";
import { Farmer } from "../../model";
import {
  ResponseGetFarmerKos01Service,
  ResponseGetFarmerKos02Service,
  ResponseGetFarmerKos03Service,
  ResponseGetFarmerKos04Service,
  ResponseGetFarmerKos05Service,
} from "../../services/farmer";
import {
  EmptyNote,
  Field,
  FieldGrid,
  ReportImages,
  ReportSection,
  ReportSheet,
  ReportTable,
  td,
  th,
} from "./ReportPrimitives";
import {
  formatIdCard,
  formatNumber,
  formatPhone,
  formatThaiDate,
  formatThaiMonth,
  formatThaiYear,
  textOrDash,
} from "./reportFormat";

type DocProps<T> = { farmer: Farmer; doc?: T };

const areaText = (plots?: number, rai?: number, ngan?: number) =>
  `${formatNumber(plots)} แปลง  พื้นที่ ${formatNumber(rai)} ไร่ ${formatNumber(ngan)} งาน`;

export function Kos01Report({ farmer, doc }: DocProps<ResponseGetFarmerKos01Service>) {
  const title = "ใบสมัครขอรับการตรวจประเมินมาตรฐานเกษตรอินทรีย์ขั้นพื้นฐาน";
  if (!doc) {
    return (
      <ReportSheet code="KOS-01" title={title} farmer={farmer}>
        <EmptyNote>เกษตรกรยังไม่ได้กรอกใบสมัคร KOS-01</EmptyNote>
      </ReportSheet>
    );
  }
  const farm = doc.farmKos1;
  const maps = [
    { url: farm?.mapHybrid, label: "แผนที่ภาพถ่ายดาวเทียม" },
    { url: farm?.mapTerrain, label: "แผนที่ภูมิประเทศ" },
  ].filter((map): map is { url: string; label: string } => !!map.url);

  return (
    <ReportSheet code="KOS-01" title={title} farmer={farmer}>
      <ReportSection title="1. ข้อมูลผู้ขอการรับรอง">
        <FieldGrid>
          <Field label="ชื่อ - นามสกุล" value={`${farmer.title} ${farmer.firstName} ${farmer.lastName}`} />
          <Field label="เลขประจำตัวประชาชน" value={formatIdCard(farmer.identityCardId)} />
          <Field label="โทรศัพท์" value={formatPhone(farmer.phoneNumber)} />
          <Field label="ที่อยู่เลขที่" value={textOrDash(doc.address)} />
          <Field label="หมู่ที่" value={textOrDash(doc.villageNumber)} />
          <Field label="ตำบล" value={textOrDash(doc.subdistrict)} />
          <Field label="อำเภอ" value={textOrDash(doc.district)} />
          <Field label="จังหวัด" value={textOrDash(doc.province)} />
        </FieldGrid>
      </ReportSection>

      <ReportSection title="2. ที่ตั้งสถานที่ผลิตพืชอินทรีย์">
        <FieldGrid>
          <Field label="ที่อยู่เลขที่" value={textOrDash(farm?.address)} />
          <Field label="หมู่ที่" value={textOrDash(farm?.villageNumber)} />
          <Field label="ตำบล" value={textOrDash(farm?.subdistrict)} />
          <Field label="อำเภอ" value={textOrDash(farm?.district)} />
          <Field label="จังหวัด" value={textOrDash(farm?.province)} />
          <Field
            label="พิกัดแปลง (UTM) 47/48"
            value={`X: ${textOrDash(farm?.latitude)}  Y: ${textOrDash(farm?.longitude)}`}
          />
        </FieldGrid>
        {maps.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {maps.map((map) => (
              <figure key={map.url} className="report-figure m-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={map.url}
                  alt={map.label}
                  loading="eager"
                  className="aspect-square w-full rounded border border-super-main-color/20 bg-fourth-color object-contain print:aspect-auto print:h-[52mm]"
                />
                <figcaption className="mt-1 text-center text-[8.5pt] text-super-main-color/70">
                  {map.label}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </ReportSection>

      <ReportSection title="3. การขอการรับรองและกระบวนการผลิต">
        <FieldGrid>
          <Field label="วันที่ขอการรับรอง" value={formatThaiDate(farm?.certRequestDate)} />
          <Field label="กระบวนการผลิต" value={farm?.productionProcess?.join(", ") || "-"} />
          <Field label="วิธีการผลิต" value={textOrDash(farm?.productionMethod)} />
        </FieldGrid>
      </ReportSection>

      <ReportSection title="4. ชนิดพืชที่ขอการรับรอง">
        <FieldGrid columns={2}>
          <Field
            label="จำนวนแปลงทั้งหมด"
            value={areaText(farm?.plotsTotal, farm?.raiTotal, farm?.nganTotal)}
          />
          <Field
            label="จำนวนแปลงที่ขอรับรอง KOS"
            value={areaText(
              farm?.certicatedPlotTotal,
              farm?.certicatedRaiTotal,
              farm?.certicatedNganTotal,
            )}
          />
        </FieldGrid>
        <div className="mt-3">
          {doc.plantKOS1s.length === 0 ? (
            <EmptyNote>ไม่มีรายการพืช</EmptyNote>
          ) : (
            <ReportTable
              head={
                <tr>
                  <th className={th}>ลำดับ</th>
                  <th className={th}>ชนิดพืช</th>
                  <th className={th}>พื้นที่ (ไร่)</th>
                  <th className={th}>รอบการผลิต/ปี</th>
                  <th className={th}>ช่วงเวลาการผลิต</th>
                  <th className={th}>วันที่คาดว่าจะเก็บเกี่ยว</th>
                  <th className={th}>ผลผลิตที่คาดว่าจะได้รับ (กก.)</th>
                </tr>
              }
            >
              {doc.plantKOS1s.map((plant, index) => (
                <tr key={plant.id}>
                  <td className={`${td} text-center`}>{index + 1}</td>
                  <td className={td}>{plant.plant}</td>
                  <td className={`${td} text-right tabular-nums`}>{formatNumber(plant.raiTotal)}</td>
                  <td className={`${td} text-right tabular-nums`}>{formatNumber(plant.annualProdCycles)}</td>
                  <td className={td}>
                    {formatThaiMonth(plant.seasonProd?.[0])} - {formatThaiMonth(plant.seasonProd?.[1])}
                  </td>
                  <td className={td}>{formatThaiDate(plant.expHarvestDate)}</td>
                  <td className={`${td} text-right tabular-nums`}>{formatNumber(plant.expYieldAmt)}</td>
                </tr>
              ))}
            </ReportTable>
          )}
        </div>
        {farm?.moreInfo && (
          <div className="mt-3">
            <Field label="ข้อมูลเพิ่มเติม" value={farm.moreInfo} />
          </div>
        )}
      </ReportSection>
    </ReportSheet>
  );
}

export function Kos02Report({
  farmer,
  doc,
  kos1,
}: DocProps<ResponseGetFarmerKos02Service> & { kos1?: ResponseGetFarmerKos01Service }) {
  const title = "ผังแปลงขอรับการตรวจประเมินมาตรฐานเกษตรอินทรีย์ขั้นพื้นฐาน";
  if (!doc) {
    return (
      <ReportSheet code="KOS-02" title={title} farmer={farmer}>
        <EmptyNote>เกษตรกรยังไม่ได้กรอกผังแปลง KOS-02</EmptyNote>
      </ReportSheet>
    );
  }
  const farm = kos1?.farmKos1;
  return (
    <ReportSheet code="KOS-02" title={title} farmer={farmer}>
      <ReportSection title="1. ข้อมูลแปลง">
        <FieldGrid columns={2}>
          <Field
            label="จำนวนแปลงทั้งหมด"
            value={areaText(farm?.plotsTotal, farm?.raiTotal, farm?.nganTotal)}
          />
          <Field
            label="จำนวนแปลงที่ขอรับรอง KOS"
            value={areaText(
              farm?.certicatedPlotTotal,
              farm?.certicatedRaiTotal,
              farm?.certicatedNganTotal,
            )}
          />
          <Field
            label="แปลงที่ขอรับรอง KOS (ตามแผนผังฟาร์ม)"
            value={textOrDash(doc.numberOfPlotForKosCertificated)}
            wide
          />
        </FieldGrid>
      </ReportSection>

      <ReportSection title="2. แผนผังแปลง">
        <ReportImages urls={doc.files.map((file) => file.url)} label="แผนผังแปลง" />
      </ReportSection>

      <ReportSection title="3. แผนการผลิตพืชอินทรีย์">
        {doc.orgCropProdCalForKos2s.length === 0 ? (
          <EmptyNote>ไม่มีแผนการผลิต</EmptyNote>
        ) : (
          <ReportTable
            head={
              <tr>
                <th className={th}>แปลงที่</th>
                <th className={th}>พื้นที่ (ไร่)</th>
                <th className={th}>ชนิดพืช</th>
                <th className={th}>ช่วงเดือน</th>
                <th className={th}>ผลผลิต (กก./ไร่)</th>
                <th className={th}>เมล็ด/ส่วนขยายพันธุ์</th>
                <th className={th}>แหล่งที่มา</th>
                <th className={th}>ปีการผลิต</th>
              </tr>
            }
          >
            {doc.orgCropProdCalForKos2s.map((crop) => (
              <tr key={crop.id}>
                <td className={`${td} text-center`}>{crop.plotNumber}</td>
                <td className={`${td} text-right tabular-nums`}>{formatNumber(crop.landArea)}</td>
                <td className={td}>{crop.plantType}</td>
                <td className={td}>{crop.rangeDate.map((date) => formatThaiMonth(date)).join(" - ")}</td>
                <td className={`${td} text-right tabular-nums`}>{formatNumber(crop.yieldPerRai)}</td>
                <td className={td}>{textOrDash(crop.seed)}</td>
                <td className={td}>{textOrDash(crop.source)}</td>
                <td className={`${td} text-center tabular-nums`}>{formatThaiYear(crop.yearPlan)}</td>
              </tr>
            ))}
          </ReportTable>
        )}
      </ReportSection>

      <ReportSection title="4. การจัดการหลังการเก็บเกี่ยวและการตลาด">
        <p className="whitespace-pre-line">{textOrDash(doc.marketingDetail)}</p>
      </ReportSection>
    </ReportSheet>
  );
}

export function Kos03Report({ farmer, doc }: DocProps<ResponseGetFarmerKos03Service>) {
  const activities = doc?.activities ?? [];
  return (
    <ReportSheet code="KOS-03" title="แบบบันทึกกิจกรรมในแปลงผลิตพืชอินทรีย์" farmer={farmer}>
      {activities.length === 0 ? (
        <EmptyNote>ยังไม่มีบันทึกกิจกรรม KOS-03</EmptyNote>
      ) : (
        <ReportTable
          head={
            <tr>
              <th className={`${th} w-[9%]`}>ลำดับ</th>
              <th className={`${th} w-[9%]`}>แปลงที่</th>
              <th className={`${th} w-[18%]`}>วัน เดือน ปี</th>
              <th className={th}>รายละเอียดกิจกรรม</th>
              <th className={`${th} w-[30%]`}>รูปภาพ</th>
            </tr>
          }
        >
          {activities.map((activity, index) => (
            <tr key={activity.id}>
              <td className={`${td} text-center`}>{index + 1}</td>
              <td className={`${td} text-center`}>{activity.plotNumber}</td>
              <td className={td}>{formatThaiDate(activity.activityDate)}</td>
              <td className={`${td} whitespace-pre-line`}>{textOrDash(activity.note)}</td>
              <td className={td}>
                {activity.files.length === 0 ? (
                  "-"
                ) : (
                  <div className="grid grid-cols-2 gap-1">
                    {activity.files.map((file, fileIndex) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={file.id}
                        src={file.url}
                        alt={`รูปกิจกรรมแปลงที่ ${activity.plotNumber} รูปที่ ${fileIndex + 1}`}
                        loading="eager"
                        className="aspect-square w-full rounded border border-super-main-color/20 object-cover"
                      />
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </ReportTable>
      )}
    </ReportSheet>
  );
}

export function Kos04Report({ farmer, doc }: DocProps<ResponseGetFarmerKos04Service>) {
  const factors = doc?.factors ?? [];
  return (
    <ReportSheet code="KOS-04" title="แบบบันทึกปัจจัยการผลิตในแปลงผลิตพืชอินทรีย์" farmer={farmer}>
      {factors.length === 0 ? (
        <EmptyNote>ยังไม่มีบันทึกปัจจัยการผลิต KOS-04</EmptyNote>
      ) : (
        <ReportTable
          head={
            <tr>
              <th className={`${th} w-[9%]`}>ลำดับ</th>
              <th className={`${th} w-[20%]`}>วันที่ซื้อหรือได้มา</th>
              <th className={th}>ชนิดของปัจจัยการผลิต</th>
              <th className={`${th} w-[16%]`}>ปริมาณ</th>
              <th className={`${th} w-[24%]`}>แหล่งที่มา</th>
            </tr>
          }
        >
          {factors.map((factor, index) => (
            <tr key={factor.id}>
              <td className={`${td} text-center`}>{index + 1}</td>
              <td className={td}>{formatThaiDate(factor.purchaseDate)}</td>
              <td className={td}>{factor.prodFactorTypes}</td>
              <td className={`${td} text-right tabular-nums`}>
                {formatNumber(factor.amount)} {factor.typeAmount}
              </td>
              <td className={td}>{textOrDash(factor.source)}</td>
            </tr>
          ))}
        </ReportTable>
      )}
    </ReportSheet>
  );
}

export function Kos05Report({ farmer, doc }: DocProps<ResponseGetFarmerKos05Service>) {
  const harvests = doc?.harvests ?? [];
  return (
    <ReportSheet code="KOS-05" title="แบบบันทึกการเก็บเกี่ยวผลผลิตในแปลงผลิตพืชอินทรีย์" farmer={farmer}>
      {harvests.length === 0 ? (
        <EmptyNote>ยังไม่มีบันทึกการเก็บเกี่ยว KOS-05</EmptyNote>
      ) : (
        <ReportTable
          head={
            <tr>
              <th className={`${th} w-[9%]`}>ลำดับ</th>
              <th className={`${th} w-[9%]`}>แปลงที่</th>
              <th className={`${th} w-[19%]`}>วัน เดือน ปี</th>
              <th className={th}>ชนิดพืชที่เก็บเกี่ยว</th>
              <th className={`${th} w-[15%]`}>ปริมาณ</th>
              <th className={`${th} w-[24%]`}>การตลาด (แหล่งจำหน่าย)</th>
            </tr>
          }
        >
          {harvests.map((harvest, index) => (
            <tr key={harvest.id}>
              <td className={`${td} text-center`}>{index + 1}</td>
              <td className={`${td} text-center`}>{harvest.plotNumber}</td>
              <td className={td}>{formatThaiDate(harvest.harvestDate)}</td>
              <td className={td}>{harvest.plantType}</td>
              <td className={`${td} text-right tabular-nums`}>
                {formatNumber(harvest.amount)} {harvest.typeAmount || "กก."}
              </td>
              <td className={td}>{textOrDash(harvest.marketing)}</td>
            </tr>
          ))}
        </ReportTable>
      )}
    </ReportSheet>
  );
}
