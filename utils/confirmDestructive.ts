import Swal from "sweetalert2";

type ConfirmDestructiveOptions = {
  title: string;
  /** Plain text (not HTML), so user data can be included safely. */
  text: string;
  confirmText: string;
};

/**
 * Asks before an action that can't be undone. Focus starts on "ยกเลิก" so an
 * accidental Enter does nothing. Resolves true only when the user confirms.
 */
export const confirmDestructive = async ({
  title,
  text,
  confirmText,
}: ConfirmDestructiveOptions) => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#dc2626",
    reverseButtons: true,
    focusCancel: true,
  });
  return result.isConfirmed;
};
