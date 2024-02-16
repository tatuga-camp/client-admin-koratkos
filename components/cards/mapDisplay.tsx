import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { menuDisplayMap } from "../../data/menus";
import Image from "next/image";
import { UseQueryResult } from "@tanstack/react-query";
import { ResponseGetFarmerKos01Service } from "../../services/farmer";
import { backgroundImageBase64 } from "../../data/base64Images";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MdPersonPinCircle } from "react-icons/md";
const containerStyle = {
  width: "24rem",
  height: "21rem",
};

type MapDisplayProps = {
  setTriggerMap: React.Dispatch<React.SetStateAction<boolean>>;
  kos01: UseQueryResult<ResponseGetFarmerKos01Service, Error>;
};
function MapDisplay({ setTriggerMap, kos01 }: MapDisplayProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
  });
  const center = {
    lat: Number(kos01.data?.farmKos1.latitude),
    lng: Number(kos01.data?.farmKos1.longitude),
  };
  const [selectMapMenu, setSelectMapMenu] = useState(0);
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-40 m-auto flex h-screen w-screen items-center justify-center">
      <main className="bg-fifth-color flex max-h-[30rem] w-max flex-col items-center justify-start gap-3 rounded-lg p-5">
        <header className="relative flex w-full justify-center">
          <h1 className="text-xl font-semibold text-white">พิกัดแปลง</h1>
          <IoIosCloseCircleOutline
            onClick={() => setTriggerMap(() => false)}
            className="absolute right-0  top-0 cursor-pointer text-3xl text-white"
          />
        </header>
        <ul className="mt-5 flex w-full items-center justify-center gap-5">
          {menuDisplayMap.map((menu, index) => {
            return (
              <li
                onClick={() => setSelectMapMenu(() => index)}
                className={`  w-max cursor-pointer rounded-lg transition duration-100 hover:scale-105
                 active:scale-110 ${selectMapMenu === index ? "bg-fifth-color text-fourth-color ring-2 ring-fourth-color" : "text-fifth-color bg-fourth-color"} px-5 py-1 font-semibold`}
                key={index}
              >
                {menu}
              </li>
            );
          })}
        </ul>
        <div className="relative h-96 w-96 overflow-hidden rounded-lg ring-1 ring-white ">
          {selectMapMenu === 0 && (
            <Image
              src={kos01.data?.farmKos1.mapTerrain as string}
              fill
              placeholder="blur"
              blurDataURL={backgroundImageBase64}
              className="object-contain"
              alt="map"
            />
          )}
          {selectMapMenu === 1 && (
            <Image
              src={kos01.data?.farmKos1.mapHybrid as string}
              fill
              placeholder="blur"
              blurDataURL={backgroundImageBase64}
              className="object-contain"
              alt="map"
            />
          )}
          {selectMapMenu === 2 && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={18}
            >
              <Marker position={center}></Marker>
              {/* Child components, such as markers, info windows, etc. */}
            </GoogleMap>
          )}
        </div>
      </main>
      <footer
        onClick={() => setTriggerMap(() => false)}
        className="fixed bottom-0 left-0 right-0 top-0 
      -z-10 m-auto  h-screen w-screen bg-white/40 backdrop-blur-sm "
      ></footer>
    </div>
  );
}

export default MapDisplay;
