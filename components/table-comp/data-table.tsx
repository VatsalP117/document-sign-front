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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
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
  const [inputValue, setInputValue] = useState("");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      console.log("Selected file:", file.name);
      console.log("File size:", file.size, "bytes");
      console.log("File type:", file.type);
      // You can perform further operations with the file here
      // For example, you could start an upload process
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddValue = () => {
    if (inputValue.trim() !== "") {
      //only add if the value is not already in the array
      if (!values.includes(inputValue.trim())) {
        setValues([...values, inputValue.trim()]);
      }
      //clear the input value
      setInputValue("");
    }
  };

  const handleRemoveValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Submit New Document for Approval</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] lg:max-w-[820px]">
            <DialogHeader>
              <DialogTitle>Document for Approval</DialogTitle>
              <DialogDescription>
                Select the document and fill the details below. Supported file
                types: .pdf, .doc, .docx.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Document Title
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="signatories" className="text-right">
                  Add Signatories
                </Label>
                <div className="flex flex-row min-w-80 items-center gap-2">
                  <Input
                    id="signatories"
                    type="text"
                    placeholder="Enter Signatory Email"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="flex-grow"
                  />

                  <Button onClick={handleAddValue}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              <Button
                className="max-w-[200px] mx-auto"
                onClick={() =>
                  //check if hod.csis@goa.bits-pilani.ac.in is in the values array
                  !values.includes("hod.csis@goa.bits-pilani.ac.in") &&
                  setValues([...values, "hod.csis@goa.bits-pilani.ac.in"])
                }
              >
                Quick Add : CSIS HOD
              </Button>
              {values.length > 0 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Signatories Added</Label>
                  <div className="flex flex-wrap min-w-96">
                    {values.map((value, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 my-2 mx-1"
                      >
                        {value}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-auto p-0"
                          onClick={() => handleRemoveValue(index)}
                        >
                          <X className="w-3 h-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <FilePicker
                onFileSelect={handleFileSelect}
                accept=".pdf,.doc,.docx"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                onClick={async (e) => {
                  console.log("Submitting...");
                  setLoading(true);
                  e.preventDefault();
                  if (!selectedFile || title === "" || values.length === 0) {
                    alert("Please enter valid input!");
                    setLoading(false);
                    return;
                  }

                  const formData = new FormData();
                  formData.append("file", selectedFile);
                  formData.append("title", title);
                  formData.append("signatories", JSON.stringify(values));
                  try {
                    //send email and other stuff
                    const response = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });
                    setLoading(false);
                    if (response.ok) {
                      const result = await response.text();
                      alert(
                        "Document Uploaded Successfully! Refresh the page to see the changes."
                      );
                      setOpen(false);
                    } else {
                      throw new Error("File upload failed");
                    }
                  } catch (error) {
                    setOpen(false);
                    setLoading(false);
                    console.error("Error:", error);
                    alert("An error occurred while uploading the file.");
                  }
                }}
              >
                {loading ? "Loading..." : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  {row.original.status === "Rejected" && (
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>View Remarks</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rejection Reason</DialogTitle>
                            <DialogDescription>
                              {row.original.remarks}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  )}
                  {row.original.status !== "Rejected" && (
                    <TableCell onClick={() => console.log(row.original)}>
                      {row.original.status === "Pending" ? (
                        <Button disabled>Download</Button>
                      ) : (
                        <Button
                          onClick={async () => {
                            const fileId = row.original.drive_id;
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

                              if (!response.ok)
                                throw new Error("Download failed");

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
                      )}
                    </TableCell>
                  )}
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
