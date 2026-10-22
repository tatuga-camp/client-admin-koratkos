import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { LuLoader2, LuSearch } from "react-icons/lu";
import { backgroundImageBase64 } from "../../data/base64Images";
import { GetListFarmersService } from "../../services/farmer";

const SEARCH_DEBOUNCE_MS = 400;

/** Global "jump to farmer" search in the top bar. */
function FarmerSearch({ className = "" }: { className?: string }) {
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(term.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [term]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const farmers = useQuery({
    queryKey: ["farmers", debouncedTerm],
    queryFn: () => GetListFarmersService({ firstName: debouncedTerm }),
    enabled: debouncedTerm !== "",
  });

  const trimmed = term.trim();
  const isSearching = trimmed !== "" && (trimmed !== debouncedTerm || farmers.isFetching);
  const showPanel = open && trimmed !== "";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label htmlFor="farmer-search" className="sr-only">
        ค้นหาเกษตรกร
      </label>
      <LuSearch
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-super-main-color/60"
      />
      <input
        id="farmer-search"
        type="search"
        autoComplete="off"
        value={term}
        onChange={(event) => {
          setTerm(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setTerm("");
            setOpen(false);
          }
        }}
        placeholder="ค้นหาเกษตรกรด้วยชื่อจริง"
        className="input pl-9"
      />

      {showPanel && (
        <div className="absolute inset-x-0 top-12 z-40 overflow-hidden rounded-xl border border-third-color bg-white shadow-lg shadow-super-main-color/10">
          {isSearching ? (
            <p className="flex items-center gap-2 px-4 py-3 text-sm text-super-main-color/80">
              <LuLoader2 className="size-4 motion-safe:animate-spin" />
              กำลังค้นหา
            </p>
          ) : farmers.data && farmers.data.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-1">
              {farmers.data.map((farmer) => (
                <li key={farmer.id}>
                  <Link
                    href={`/farmer/${farmer.id}`}
                    onClick={() => {
                      setOpen(false);
                      setTerm("");
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-super-main-color hover:bg-fourth-color focus-visible:bg-fourth-color focus-visible:outline-none"
                  >
                    <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-third-color">
                      <Image
                        src={farmer.picture}
                        fill
                        alt=""
                        sizes="32px"
                        placeholder="blur"
                        blurDataURL={backgroundImageBase64}
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {farmer.firstName} {farmer.lastName}
                      </span>
                      <span className="block text-xs text-super-main-color/70">
                        {farmer.phoneNumber}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-super-main-color/80">
              ไม่พบเกษตรกรชื่อ “{trimmed}”
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default FarmerSearch;
