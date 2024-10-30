"use client";
import { Project, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";

async function getData(setData: any): Promise<Boolean> {
  // Fetch data from your API here.

  //get data from my api
  const response = await fetch("/api/documents", {
    method: "GET",
    withCredentials: true,
  });
  if (response.status === 200) {
    const data = await response.json();
    console.log(data);
    //need to map this data to our frontend key names
    const newData = data.map((item: any) => {
      return {
        id: item.document_id,
        document_title: item.title,
        signatories: item.signatories,
        drive_id: item.drive_file_id_out,
        remarks: item.remarks,
        //capitalize the first letter of status
        //the data received is a datetime object
        //o convert to just a date string?
        // createdAt: item.createdAt.toISOString().slice(0, 10),
        // updatedAt:
        //   item.status === "pending"
        //     ? ""
        //     : item.updatedAt.toISOString().slice(0, 10),
        createdAt: item.createdAt.split("T")[0],
        updatedAt:
          item.status === "pending" ? "" : item.updatedAt.split("T")[0],
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      };
    });
    setData(newData);
  }
  return true;
}

export default function Comp() {
  const [data, setData] = useState([]);
  const [ogData, setOgData] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [checked, setChecked] = useState("indeterminate");
  const [open, setOpen] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [value, setValue] = useState("All Tags");
  useEffect(() => {
    getData(setData);
  }, []);
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
