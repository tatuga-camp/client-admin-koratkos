import React from "react";
import { IconType } from "react-icons/lib";

type MenuCardEvaluationFarmerProps = {
  card: {
    title: string;
    description: string;
    button: string;
    icon?: IconType;
  };
  index: number;
  selectMenu: number;
  setSelectMenu: React.Dispatch<React.SetStateAction<number>>;
};
function MenuCardEvaluationFarmer({
  card,
  index,
  selectMenu,
  setSelectMenu,
}: MenuCardEvaluationFarmerProps) {
  return (
    <div
      onClick={() => setSelectMenu(() => index)}
      className={`group hover:bg-fifth-color ${selectMenu === index ? "bg-fifth-color" : "bg-fourth-color "} flex h-full w-full cursor-pointer
       flex-col  items-center justify-around gap-2 rounded-lg p-4 font-Anuphan`}
    >
      <h1 className="text-lg font-semibold text-super-main-color group-hover:text-white xl:text-2xl">
        {card.title}
      </h1>
      <p className="line-clamp-2 text-balance text-center text-[0.7rem] xl:text-xs">
        {card.description}
      </p>
      <button
        className={`${card.title === "KOS-06" ? "bg-secondary-color" : "bg-fifth-color"} flex items-center  justify-center 
      gap-1 rounded-lg px-5 py-1 text-xs font-semibold ${selectMenu === index ? "bg-fourth-color text-black" : "text-white"}  group-hover:bg-fourth-color group-hover:text-black`}
      >
        {card.icon && <card.icon className="hidden xl:block" />}
        {card.button}
      </button>
    </div>
  );
}

export default MenuCardEvaluationFarmer;
