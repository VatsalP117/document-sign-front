"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "../ui/badge";
export type Document = {
  id: string;
  document_title: string;
  signatories: string[];
  status: "Pending" | "Completed";
};

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "document_title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Document Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Link className="max-w-[500px] truncate font-medium" href="/login">
            {row.getValue("document_title")}
          </Link>
        </div>
      );
    },
  },

  {
    accessorKey: "signatories",
    header: "Signatories",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate  flex flex-row gap-2 flex-wrap">
            {row.getValue("signatories").map((tag: any) => (
              <Badge variant="secondary">{tag}</Badge>
            ))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
