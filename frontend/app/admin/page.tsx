"use client";
import withAuth from "@/app/withAuth";
import Logout from "@/components/logout";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Admin() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  return (
    <div className="container flex h-[90vh] flex-row items-center justify-center py-8 md:gap-4 lg:gap-6">
      <Logout />
      <Button
        className="relative overflow-hidden
      text-white font-semibold py-2 px-4 rounded
      bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500
      bg-[length:200%_100%]
      animate-gradient"
        onClick={() => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hello`)
            .then((res) => res.text())
            .then((data) => {
              let link = document.createElement("a");
              link.setAttribute("href", data);
              link.setAttribute("download", "data.csv");
              document.body.appendChild(link);
              link.click();
            });
        }}
      >
        Download CSV
      </Button>
      <Dialog>
        <DialogTrigger>
          <Button>Set Deadline</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
            <DialogDescription className="flex flex-col gap-4 justify-center items-center">
              {/* This action cannot be undone. This will permanently delete your
              account and remove your data from our servers. */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    //send request with startDate and endDate
                    fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/setdeadline`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          startDate: startDate,
                          endDate: endDate,
                        }),
                      }
                    );
                  }}
                >
                  Save Changes
                </Button>
              </DialogClose>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default withAuth(Admin, "admin");
