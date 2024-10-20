"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRef } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
import { useEffect } from "react";
import Link from "next/link";
import FilePicker from "../file-picker";
import { set } from "date-fns";
import { setLazyProp } from "next/dist/server/api-utils";
import { sign } from "crypto";
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentId", documentId);

    try {
      alert("File uploading... Please wait and avoid multiple clicks.");
      const response = await axios.post(
        "/api/upload-signed-document/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
      alert("File uploaded successfully! Refresh the page to see the changes.");
      // Handle success (e.g., show a success message to the user)
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
      // Handle error (e.g., show an error message to the user)
    }
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    state: {
      columnFilters,
      sorting,
    },
  });
  useEffect(() => {
    table.setPageSize(5);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center pb-4 md:pb-6 lg:pb-8 gap-10">
        <Input
          placeholder="Search Documents"
          value={
            (table.getColumn("document_title")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) => {
            table
              .getColumn("document_title")
              ?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border p-2 md:p-4 lg:p-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button>Delete</Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={async () => {
                        console.log(row.original);
                        const fileId = row.original.drive_id;
                        console.log(fileId);
                        try {
                          alert(
                            "File download will begin in a few seconds. Please be patient and avoid clicking multiple times."
                          );
                          const response = await fetch(
                            `/api/download/${fileId}`,
                            {
                              method: "GET",
                            }
                          );

                          if (!response.ok) throw new Error("Download failed");

                          // Get the filename from the custom header
                          const contentDisposition = response.headers.get(
                            "Content-Disposition"
                          );
                          let filename = "download"; // default filename

                          if (contentDisposition) {
                            const filenameRegex =
                              /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                            const matches =
                              filenameRegex.exec(contentDisposition);
                            if (matches != null && matches[1]) {
                              filename = matches[1].replace(/['"]/g, "");
                            }
                          }

                          // If the regex method didn't work, try the custom header
                          if (filename === "download") {
                            const customFilename =
                              response.headers.get("X-Filename");
                            if (customFilename) {
                              filename = decodeURIComponent(customFilename);
                            }
                          }

                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.style.display = "none";
                          a.href = url;
                          a.download = filename;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          alert(
                            "An error occurred while downloading the file."
                          );
                          console.error("Error downloading file:", error);
                        }
                      }}
                    >
                      Download
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setDocumentId(row.original.id);
                        fileInputRef.current.click();
                      }}
                    >
                      Upload Signed Document
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
