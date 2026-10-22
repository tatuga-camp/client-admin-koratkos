import React, { useState } from "react";
import { menuDisplayMap } from "../../data/menus";
import Image from "next/image";
import { UseQueryResult } from "@tanstack/react-query";
import { ResponseGetFarmerKos01Service } from "../../services/farmer";
import { backgroundImageBase64 } from "../../data/base64Images";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { LuMapPin } from "react-icons/lu";
import Modal from "../ui/Modal";

const containerStyle = {
  width: "100%",
  height: "100%",
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
  const mapImage =
    selectMapMenu === 0
      ? kos01.data?.farmKos1.mapTerrain
      : selectMapMenu === 1
        ? kos01.data?.farmKos1.mapHybrid
        : undefined;

  return (
    <Modal
      open
      onClose={() => setTriggerMap(() => false)}
      title="พิกัดแปลง"
      description={
        <span className="inline-flex items-center gap-1.5 tabular-nums">
          <LuMapPin aria-hidden="true" className="size-4 shrink-0" />
          {kos01.data?.farmKos1.latitude}, {kos01.data?.farmKos1.longitude}
        </span>
      }
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <div className="-mx-5 overflow-x-auto px-5">
          <div className="segmented" role="group" aria-label="รูปแบบแผนที่">
            {menuDisplayMap.map((menu, index) => {
              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => setSelectMapMenu(() => index)}
                  aria-pressed={selectMapMenu === index}
                  className="segmented-item"
                >
                  {menu}
                </button>
              );
            })}
          </div>
        </div>
        <div className="relative h-72 w-full overflow-hidden rounded-lg border border-third-color bg-third-color/40 sm:h-96">
          {selectMapMenu === 2 ? (
            isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={18}
              >
                <Marker position={center}></Marker>
              </GoogleMap>
            ) : (
              <div className="size-full animate-pulse bg-third-color" />
            )
          ) : mapImage ? (
            <Image
              src={mapImage}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              placeholder="blur"
              blurDataURL={backgroundImageBase64}
              className="object-contain"
              alt={`${menuDisplayMap[selectMapMenu]}ของแปลง`}
            />
          ) : (
            <p className="flex size-full items-center justify-center px-4 text-center text-sm text-super-main-color/80">
              ไม่มีภาพ{menuDisplayMap[selectMapMenu]}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default MapDisplay;
