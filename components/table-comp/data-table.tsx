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
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [inputValue, setInputValue] = useState("");
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
      setValues([...values, inputValue.trim()]);
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
        <Dialog>
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
                <Input id="title" className="col-span-3" />
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
              <Button type="submit">Submit</Button>
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
                  <TableCell onClick={() => console.log(row.original)}>
                    {row.original.status === "Pending" ? (
                      <Button disabled>Download</Button>
                    ) : (
                      <Button>Download</Button>
                    )}
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
