"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense, useEffect } from "react";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Comp from "@/components/table-comp/comp";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import withAuth from "@/app/withAuth";
import UserCard from "@/components/user-card";
import { useState } from "react";
import { toast } from "sonner";
import Logout from "@/components/logout";

const Dashboard = (props: any) => {
  console.log(props);
  return (
    <div className="flex h-[90vh] w-full p-10 lg:p-12 xl:p-14flex-row py-8 md:gap-6 lg:gap-10 xl:gap-12">
      <div className="basis-1/4  flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <UserCard name={props.user.name} email={props.user.email} avatarUrl={props.user.image}/>
          <div className="w-3/4 mx-auto">
            <Logout />
          </div>
        </div>
      </div>
      <div className="projects-section basis-3/4 ">
        <Comp />
      </div>
    </div>
  );
};

export default withAuth(Dashboard, "faculty");
// export default Dashboard;
