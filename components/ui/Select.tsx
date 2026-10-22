import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { LuCheck, LuChevronDown, LuLoader2, LuX } from "react-icons/lu";

type SelectProps<T> = {
  value: T | null;
  onChange: (value: T | null) => void;
  options: T[] | undefined;
  getLabel: (option: T) => string;
  getKey: (option: T) => string | number;
  placeholder: string;
  /** Accessible name; rendered visually only when `showLabel` is set. */
  label: string;
  showLabel?: boolean;
  clearable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Themed single-select dropdown (keyboard and screen-reader support via Headless UI). */
function Select<T>({
  value,
  onChange,
  options,
  getLabel,
  getKey,
  placeholder,
  label,
  showLabel = false,
  clearable = false,
  loading = false,
  disabled = false,
  className = "",
}: SelectProps<T>) {
  return (
    <Listbox
      value={value}
      onChange={onChange}
      by={(a: T | null, b: T | null) => (a && b ? getKey(a) === getKey(b) : a === b)}
      disabled={disabled}
    >
      <div className={`relative flex flex-col gap-1.5 ${className}`}>
        <Listbox.Label className={showLabel ? "label" : "sr-only"}>{label}</Listbox.Label>
        <div className="relative">
          <Listbox.Button
            className={`input flex items-center text-left ${clearable && value ? "pr-16" : "pr-9"}`}
          >
            <span className={`block truncate ${value ? "" : "text-super-main-color/60"}`}>
              {value ? getLabel(value) : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              {loading ? (
                <LuLoader2 aria-hidden="true" className="size-4 text-super-main-color/60 motion-safe:animate-spin" />
              ) : (
                <LuChevronDown aria-hidden="true" className="size-4 text-super-main-color/60" />
              )}
            </span>
          </Listbox.Button>
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label={`ล้าง${label}`}
              className="absolute inset-y-0 right-8 my-auto flex size-6 items-center justify-center rounded text-super-main-color/60 hover:bg-third-color/60 hover:text-super-main-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color"
            >
              <LuX aria-hidden="true" className="size-3.5" />
            </button>
          )}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-30 mt-1 max-h-64 w-full min-w-[12rem] overflow-auto rounded-xl border border-third-color bg-white py-1 text-sm shadow-lg shadow-super-main-color/10 focus:outline-none">
              {loading && !options?.length ? (
                <p className="px-3 py-2 text-super-main-color/70">กำลังโหลด</p>
              ) : !options?.length ? (
                <p className="px-3 py-2 text-super-main-color/70">ไม่มีตัวเลือก</p>
              ) : (
                options.map((option) => (
                  <Listbox.Option
                    key={getKey(option)}
                    value={option}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-9 pr-3 text-super-main-color ${active ? "bg-fourth-color" : ""}`
                    }
                  >
                    {({ selected }) => (
                      <>
                        {selected && (
                          <LuCheck
                            aria-hidden="true"
                            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-main-color"
                          />
                        )}
                        <span className={`block truncate ${selected ? "font-semibold" : ""}`}>
                          {getLabel(option)}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </div>
    </Listbox>
  );
}

export default Select;
