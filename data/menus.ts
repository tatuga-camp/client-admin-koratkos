import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { FaEdit } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { HiDocumentCheck } from "react-icons/hi2";
import { RiAdminFill } from "react-icons/ri";

import {
  GetAllFailEvaluationCountService,
  GetAllFarmerCountService,
  GetAllPendingEvaluationCountService,
  GetAllSuccessEvaluationCountService,
} from "../services/overview";
import { FaLock } from "react-icons/fa";
import { AiOutlineFundView } from "react-icons/ai";
import { User } from "../model";

export const menusSidebar = ({ user }: { user: User }) => {
  let menus = [
    {
      title: "หน้าหลัก",
      href: "/",
      icon: GoHomeFill,
    },
    {
      title: "การตั้งค่า",
      href: "/account/setting",
      icon: IoSettingsOutline,
    },
  ];

  if (user.role === "admin") {
    menus.push({
      title: "ผู้ดูแลระบบ",
      href: "/admin",
      icon: RiAdminFill,
    });
  }
  return menus;
};

export const statisticMenuCards = (): {
  title: string;
  number: "loading" | number;
}[] => {
  const farmer = useQuery({
    queryKey: ["farmer-number"],
    queryFn: () => GetAllFarmerCountService(),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });
  const successEvaluation = useQuery({
    queryKey: ["success-evaluation"],
    queryFn: () => GetAllSuccessEvaluationCountService(),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });
  const failEvaluation = useQuery({
    queryKey: ["fail-evaluation"],
    queryFn: () => GetAllFailEvaluationCountService(),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
  });
  const pendingEvaluation = useQuery({
    queryKey: ["pending-evaluation"],
    queryFn: () => GetAllPendingEvaluationCountService(),
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 6,
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

export const menuAccountSetting = () => {
  return [
    {
      title: "แก้ไขข้อมูลส่วนตัว",
      icon: FaEdit,
    },
    {
      title: "การเข้าสู่ระบบและความปลอดภัย",
      icon: FaLock,
    },
  ] as const;
};

export const MenuFarmerEvaluation = [
  {
    title: "KOS-01",
    description: "ใบสมัครขอรับการตรวจ ประเมินมาตรฐานเกษตร อินทรีย์ขั้นพื้นฐาน",
    button: "ดูข้อมูล",
    icon: AiOutlineFundView,
  },
  {
    title: "KOS-02",
    description: "ผังแปลง ขอรับการตรวจประเมิน มาตรฐานเกษตรอินทรีย์ ขั้นพื้นฐาน",
    button: "ดูข้อมูล",
    icon: AiOutlineFundView,
  },
  {
    title: "KOS-03",
    description: "แบบบันทึก กิจกรรมในแปลง ผลิตพืชอินทรีย์",
    button: "ดูข้อมูล",
    icon: AiOutlineFundView,
  },
  {
    title: "KOS-04",
    description: "แบบบันทึก ปัจจัยการผลิตในแปลง ผลิตพืชอินทรีย์",
    button: "ดูข้อมูล",
    icon: AiOutlineFundView,
  },
  {
    title: "KOS-05",
    description: "แบบบันทึก การเก็บเกี่ยวในแปลง ผลิตพืชอินทรีย์",
    button: "ดูข้อมูล",
    icon: AiOutlineFundView,
  },
  {
    title: "KOS-06",
    description: "แบบประเมินเกษตรอินทรีย์ ขั้นพื้นฐาน",
    button: "ประเมิน",
  },
] as const;

export const menuDisplayMap = [
  "แผนที่",
  "แผนที่ทางภูมิศาสตร์",
  "Google map",
] as const;
