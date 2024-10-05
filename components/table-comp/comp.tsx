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
  setData([
    {
      id: "728ed52f",
      document_title: "Test Document 1",
      signatories: ["hod.csis@goa"],
      status: "Pending",
    },
    {
      id: "7dhjs8ed52f",
      document_title: "Test Document 2",
      signatories: ["hod.csis@goa", "xyz@abc.com"],
      status: "Completed",
    },
  ]);

  //   const response = await fetch("/api/student/getallprojects", {
  //     method: "GET",
  //     withCredentials: true,
  //   });

  //   if (response.status === 200) {
  //     const data = await response.json();
  //     setData(data);
  //   } else {
  //     console.log("Error in fetching data");
  //   }

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
