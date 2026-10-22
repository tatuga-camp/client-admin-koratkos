import React from "react";
import { Farmer, StatusEvaluation } from "../../model";
import { ResponseGetFormEvaluationService } from "../../services/evaluation";
import {
  EmptyNote,
  Field,
  FieldGrid,
  ReportSection,
  ReportSheet,
  ReportTable,
  SignatureBlock,
  td,
  th,
} from "./ReportPrimitives";
import {
  evaluationResultText,
  evaluationStatusText,
  formatThaiDate,
  textOrDash,
} from "./reportFormat";

type Kos06ReportProps = {
  farmer: Farmer;
  /** One entry per evaluation round, any order. */
  evaluations: ResponseGetFormEvaluationService[];
};

const byOrder = (a: { order: string }, b: { order: string }) =>
  Number(a.order) - Number(b.order) || a.order.localeCompare(b.order);

const resultTone: Record<StatusEvaluation, string> = {
  approved: "text-main-color",
  rejected: "text-red-700",
  pending: "text-super-main-color/70",
};

function Kos06Report({ farmer, evaluations }: Kos06ReportProps) {
  const title = "แบบประเมินเกษตรอินทรีย์ขั้นพื้นฐาน";
  const rounds = [...evaluations].sort(
    (a, b) => a.formEvaluation.number - b.formEvaluation.number,
  );

  if (rounds.length === 0) {
    return (
      <ReportSheet code="KOS-06" title={title} farmer={farmer}>
        <EmptyNote>ยังไม่มีผลการประเมิน KOS-06</EmptyNote>
      </ReportSheet>
    );
  }

  // Criteria are the same in every round; answers are looked up per round
  // because unanswered criteria have no listFormEvaluation yet.
  const topics = [...rounds[0].topics].sort(byOrder).map((topic) => ({
    ...topic,
    childs: [...topic.childs].sort(byOrder),
  }));
  const answersByRound = rounds.map(
    (round) =>
      new Map(
        round.topics
          .flatMap((topic) => topic.childs)
          .map((child) => [child.id, child.listFormEvaluation] as const),
      ),
  );
  const latest = rounds[rounds.length - 1].formEvaluation;
  const evaluators = [
    { name: latest.first_evaluator_name, role: latest.first_evaluator_position },
    { name: latest.second_evaluator_name, role: latest.second_evaluator_position },
    { name: latest.third_evaluator_name, role: latest.third_evaluator_position },
  ];

  return (
    <ReportSheet code="KOS-06" title={title} farmer={farmer}>
      <ReportSection title="1. สรุปผลการประเมิน">
        <ReportTable
          head={
            <tr>
              <th className={`${th} w-[10%]`}>ครั้งที่</th>
              <th className={`${th} w-[20%]`}>วันที่ประเมิน</th>
              <th className={`${th} w-[18%]`}>ผลการประเมิน</th>
              <th className={`${th} w-[20%]`}>ผู้บันทึก</th>
              <th className={th}>ข้อเสนอแนะ</th>
            </tr>
          }
        >
          {rounds.map(({ formEvaluation }) => {
            const status = formEvaluation.status ?? "pending";
            return (
              <tr key={formEvaluation.id ?? formEvaluation.number}>
                <td className={`${td} text-center`}>{formEvaluation.number}</td>
                <td className={td}>{formatThaiDate(formEvaluation.evaluatedDate)}</td>
                <td className={`${td} font-semibold ${resultTone[status]}`}>
                  {evaluationStatusText[status]}
                </td>
                <td className={td}>
                  {formEvaluation.user
                    ? `${formEvaluation.user.firstName} ${formEvaluation.user.lastName}`
                    : "-"}
                </td>
                <td className={`${td} whitespace-pre-line`}>{textOrDash(formEvaluation.reason)}</td>
              </tr>
            );
          })}
        </ReportTable>
      </ReportSection>

      <ReportSection title="2. ผลการประเมินรายข้อ">
        <ReportTable
          head={
            <tr>
              <th className={`${th} w-[8%]`}>ข้อ</th>
              <th className={th}>รายการประเมิน</th>
              {rounds.map(({ formEvaluation }) => (
                <th key={formEvaluation.number} className={`${th} w-[17%]`}>
                  ครั้งที่ {formEvaluation.number}
                </th>
              ))}
            </tr>
          }
        >
          {topics.map((topic) => (
            <React.Fragment key={topic.id}>
              <tr className="report-topic-row">
                <td colSpan={2 + rounds.length} className={`${td} bg-fourth-color font-semibold`}>
                  {topic.order}. {topic.title}
                </td>
              </tr>
              {topic.childs.map((child) => (
                <tr key={child.id}>
                  <td className={`${td} text-center tabular-nums`}>{child.order}</td>
                  <td className={td}>{child.title}</td>
                  {answersByRound.map((answers, roundIndex) => {
                    const answer = answers.get(child.id);
                    const status = answer?.status ?? "pending";
                    return (
                      <td key={roundIndex} className={td}>
                        <span className={`font-semibold ${resultTone[status]}`}>
                          {evaluationResultText[status]}
                        </span>
                        {answer?.suggestion && (
                          <span className="mt-0.5 block text-[8.5pt] text-super-main-color/80">
                            {answer.suggestion}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </ReportTable>
      </ReportSection>

      <section className="report-signoff">
        <h2 className="mb-2 border-b border-super-main-color/20 pb-1 text-[11pt] font-bold">
          3. คณะผู้ประเมิน (ครั้งที่ {latest.number})
        </h2>
        <FieldGrid columns={2}>
          <Field label="วันที่ประเมิน" value={formatThaiDate(latest.evaluatedDate)} />
          <Field
            label="ผลการประเมิน"
            value={evaluationStatusText[latest.status ?? "pending"]}
          />
        </FieldGrid>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
          {evaluators.map((evaluator, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <SignatureBlock name={evaluator.name} role={evaluator.role} />
              <p className="text-[8.5pt] text-super-main-color/70">ผู้ประเมินคนที่ {index + 1}</p>
            </div>
          ))}
        </div>
      </section>
    </ReportSheet>
  );
}

export default Kos06Report;
