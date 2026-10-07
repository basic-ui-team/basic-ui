import { useCallback } from "react";
import {
  cn,
  forwardRefWithAs,
  normalizeProps,
  PolymorphicRef,
  Portal,
  useDialog,
} from "@basic-ui/react-utilities";
import { AllowedDialogElements, DialogOwnProps, DialogProps } from "./dialog.types";
import { Box } from "../Box";
import {
  dialogOverlayVariants,
  dialogBackdropVariants,
  dialogVariants,
  dialogBodyVariants,
  dialogHeaderVariants,
  dialogTitleVariants,
  dialogCloseVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
} from "./dialog.variants";
import { XIcon } from "@basic-ui/icons";

/**
 * Dialog component for displaying modal or non-modal dialogs.
 *
 * Features include support for responsive sizes, modal and non-modal behavior, and customizable headers, footers, and close buttons.
 * Supports responsive sizing.
 *
 * @example
 * // Non-modal
 * const [openNonModal, setOpenNonModal] = useState(false);
 * <button onClick={() => setOpenNonModal(true)}>Open Non-modal Dialog</button>
 * <Dialog open={openNonModal} modal={false} title="Non-modal Dialog" description="This is a non-modal dialog." />
 *
 * // Modal
 * const [openModal, setOpenModal] = useState(false);
 * <button onClick={() => setOpenModal(true)}>Open Modal Dialog</button>
 * <Dialog open={openModal} modal={true} title="Modal Dialog" description="This is a modal dialog." />
 */
export const Dialog = forwardRefWithAs<DialogOwnProps, AllowedDialogElements>(
  <As extends AllowedDialogElements = "div">(
    {
      as,
      open,
      defaultOpen,
      onOpenChange,
      title,
      description,
      "aria-label": ariaLabel,
      fullWidth = false,
      footer,
      showClose = true,
      modal = true,
      dismissOnOutside,
      lockScroll,
      className,
      children,
      ...rest
    }: DialogProps<As>,
    ref: PolymorphicRef<As>,
  ) => {
    const {
      open: isOpen,
      onClose,
      dialogRef,
      dialogProps,
      titleProps,
      descriptionProps,
    } = useDialog({
      open,
      defaultOpen,
      onOpenChange,
      title: typeof title === "string" ? title : ariaLabel,
      hasDescription: Boolean(description),
      modal,
      dismissOnOutside,
      lockScroll,
    });

    const setDialogRef = useCallback(
      (node: HTMLDivElement | null) => {
        dialogRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [dialogRef, ref],
    );

    if (!isOpen) return null;

    return (
      <Portal>
        <Box className={dialogOverlayVariants()}>
          {modal && <Box className={dialogBackdropVariants()} />}
          <Box
            as={as || "div"}
            className={cn(dialogVariants({ modal, fullWidth }), className)}
            {...dialogProps}
            ref={setDialogRef}
            {...(normalizeProps(rest as Record<string, unknown>) as any)}
          >
            {(title || showClose) && (
              <Box className={dialogHeaderVariants({ hasTitle: Boolean(title) })}>
                {title && (
                  <Box as="h2" className={dialogTitleVariants()} {...titleProps}>
                    {title}
                  </Box>
                )}
                {showClose && (
                  <button aria-label="Close" onClick={onClose} className={dialogCloseVariants()}>
                    <Box
                      as="span"
                      className="flex items-center justify-center w-lg h-lg"
                      aria-hidden="true"
                    >
                      <XIcon />
                    </Box>
                  </button>
                )}
              </Box>
            )}
            <Box className={dialogBodyVariants()}>
              {description && (
                <Box as="p" className={dialogDescriptionVariants()} {...descriptionProps}>
                  {description}
                </Box>
              )}
              {children}
            </Box>
            {footer && <Box className={dialogFooterVariants()}>{footer}</Box>}
          </Box>
        </Box>
      </Portal>
    );
  },
);
