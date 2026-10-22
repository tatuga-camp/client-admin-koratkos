import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";
import { LuX } from "react-icons/lu";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Sticky footer, typically the cancel / confirm buttons. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizes = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

/**
 * Accessible dialog (focus trap, Esc to close). Full-height sheet on phones,
 * centred card from `sm` up.
 */
function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50 font-Anuphan">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-super-main-color/40" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel
              className={`flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl ${sizes[size]}`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-third-color px-5 py-4">
                <div className="min-w-0">
                  <Dialog.Title className="text-lg font-semibold text-super-main-color">
                    {title}
                  </Dialog.Title>
                  {description && (
                    <Dialog.Description className="mt-0.5 text-sm text-super-main-color/80">
                      {description}
                    </Dialog.Description>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="ปิด"
                  className="btn btn-ghost btn-icon btn-sm -mr-2 w-8"
                >
                  <LuX className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
              {footer && (
                <div className="flex flex-col-reverse gap-2 border-t border-third-color px-5 py-3 sm:flex-row sm:justify-end">
                  {footer}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
