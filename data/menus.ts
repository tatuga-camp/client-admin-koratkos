import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { FaEdit } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { HiDocumentCheck } from "react-icons/hi2";
import {
  GetAllFailEvaluationCountService,
  GetAllFarmerCountService,
  GetAllPendingEvaluationCountService,
  GetAllSuccessEvaluationCountService,
} from "../services/overview";

export const menusSidebar = () => {
  return [
    {
      title: "หน้าหลัก",
      href: "/",
      icon: GoHomeFill,
    },
    {
      title: "การตั้งค่า",
      href: "/admin/setting",
      icon: IoSettingsOutline,
    },
  ];
};

export const statisticMenuCards = (): {
  title: string;
  number: "loading" | number;
}[] => {
  const farmer = useQuery({
    queryKey: ["farmer-number"],
    queryFn: () => GetAllFarmerCountService(),
  });
  const successEvaluation = useQuery({
    queryKey: ["success-evaluation"],
    queryFn: () => GetAllSuccessEvaluationCountService(),
  });
  const failEvaluation = useQuery({
    queryKey: ["fail-evaluation"],
    queryFn: () => GetAllFailEvaluationCountService(),
  });
  const pendingEvaluation = useQuery({
    queryKey: ["pending-evaluation"],
    queryFn: () => GetAllPendingEvaluationCountService(),
  });

  return [
    {
      title: "จำนวนเกษตรกร",
      number: farmer.isLoading ? "loading" : farmer.data ? farmer.data : 0,
    },
    {
      title: "จำนวนผ่านการประเมิน",
      number: successEvaluation.isLoading
        ? "loading"
        : successEvaluation.data
          ? successEvaluation.data
          : 0,
    },
    {
      title: "จำนวนรอการประเมิน",
      number: pendingEvaluation.isLoading
        ? "loading"
        : pendingEvaluation.data
          ? pendingEvaluation.data
          : 0,
    },
    {
      title: "จำนวนไม่ผ่านการประเมิน",
      number: failEvaluation.isLoading
        ? "loading"
        : failEvaluation.data
          ? failEvaluation.data
          : 0,
    },
  ];
};
