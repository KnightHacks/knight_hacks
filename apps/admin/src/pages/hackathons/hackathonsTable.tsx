import type { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutput } from "@knighthacks/api";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { trpc } from "~/trpc";
import { UpdateHackathonForm } from "./update-hackathon-form";

type Hackathon = RouterOutput["hackathons"]["getAll"][number];

export const columns: ColumnDef<Hackathon>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hackathon Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: Actions,
  },
];

function Actions({ row }: { row: Row<Hackathon> }) {
  const hackathon = row.original;

  const [updateUserFormSheetOpen, setUpdateUserFormSheetOpen] = useState(false);

  const utils = trpc.useUtils();
  const { mutate } = trpc.hackathons.deleteHackathon.useMutation({
    onSuccess: async () => {
      await utils.hackathons.getAll.invalidate();
      toast("Success!", {
        description: "User deleted",
      });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={async () => {
              await navigator.clipboard.writeText(hackathon.name);
              toast("Success!", {
                description: "Hackathon ID copied",
              });
            }}
          >
            Copy hackathon ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              mutate(hackathon.startDate);
            }}
          >
            Delete hackathon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUpdateUserFormSheetOpen(true)}>
            Update user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet
        open={updateUserFormSheetOpen}
        onOpenChange={setUpdateUserFormSheetOpen}
      >
        <SheetContent>
          <UpdateHackathonForm hackathon={hackathon} />
        </SheetContent>
      </Sheet>
    </>
  );
}
