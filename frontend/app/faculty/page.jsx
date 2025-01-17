"use client";
import CardDemo from "@/components/student-profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ModeToggle from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Logout from "@/components/logout";
import Link from "next/link";
import Comp2 from "@/components/test-faculty/comp";
import { useEffect, useState } from "react";
import withAuth from "@/app/withAuth";

const Faculty = (props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formatedStartDate, setFormatedStartDate] = useState("");
  const [formatedEndDate, setFormatedEndDate] = useState("");
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deadline`, {
      method: "GET",
      withCredentials: true,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setStartDate(data.startDate);
          setEndDate(data.endDate);
          // console.log(typeof data.startDate);
          // console.log(data.startDate);
          setFormatedStartDate(
            new Date(data.startDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          );
          setFormatedEndDate(
            new Date(data.endDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          );
        });
      } else {
        //toast("Failed to fetch student details");
      }
    });
  }, []);
  return (
    <>
      <p className="text-center text-xl font-bold mt-10 text-red-500">
        Deadline for Applications is from {formatedStartDate} to{" "}
        {formatedEndDate}
      </p>
      <div className="container flex h-[90vh] w-screen flex-row py-8 md:gap-4 lg:gap-6">
        <div className="student-data-section basis-1/4  flex flex-col gap-10">
          <Card className="student-card flex flex-row items-center justify-center">
            <Avatar className="ml-6">
              <AvatarImage src={props.user.image} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <CardHeader className="m-auto mr-4">
              <CardTitle>{props.user.name}</CardTitle>
              <CardDescription className="font-bold">
                {props.user.email}
              </CardDescription>
              <Logout />
            </CardHeader>
          </Card>

          <Button asChild>
            <Link href="/project?projectId=new">Add Project</Link>
          </Button>
        </div>
        <div className="projects-section basis-3/4 ">
          <Comp2 />
        </div>
      </div>
    </>
  );
};

export default withAuth(Faculty, "faculty");
