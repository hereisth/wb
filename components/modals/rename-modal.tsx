"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { useRenameModel } from "@/store/use-rename-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export const RenameModal = () => {
  const { isOpen, initialValues, onClose } = useRenameModel();
  const [title, setTitle] = useState(initialValues.title);
  const { mutate: updateBoard, pending } = useApiMutation(api.board.update);

  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues.title]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    updateBoard({ id: initialValues.id, title })
      .then(() => {
        toast.success("Board title updated");
        onClose();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit board title</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a new title for this board</DialogDescription>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            required
            disabled={pending}
            maxLength={60}
            value={title}
            placeholder="Enter board title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
