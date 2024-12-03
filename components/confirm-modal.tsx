"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

interface ConfirmModelProps {
  children: React.ReactNode;
  onConfirm: () => void;
  disabled?: boolean;
  header?: string;
  description?: string;
}

export const ConfirmModel: React.FC<ConfirmModelProps> = ({
  children,
  onConfirm,
  disabled,
  header,
  description,
}) => {

  const handleConfirm = () => {
    onConfirm();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>
          <AlertDialogTitle>{header}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 text-white hover:bg-red-600/80" onClick={handleConfirm} disabled={disabled}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
};
