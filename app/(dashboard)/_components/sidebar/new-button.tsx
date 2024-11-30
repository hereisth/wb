import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";
import { Hint } from "@/components/hint";

export default function NewButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="aspect-square">
          <Hint label="Create organization" side="right" align="start" sideOffset={18}>
            <button className="bg-white/25 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition">
              <Plus className="text-white" />
            </button>
          </Hint>
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-[430px]">
        {/* `DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users. see  https://radix-ui.com/primitives/docs/components/dialog. DON‘T CHANGE IT*/}
        <VisuallyHidden.Root>
          <DialogTitle>Create organization</DialogTitle>
        </VisuallyHidden.Root>
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
}
