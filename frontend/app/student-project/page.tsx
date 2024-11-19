"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import Back from "@/components/back";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Editor from "@/components/student_editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

const statuses = [
  { label: "Open", value: "Open" },
  { label: "Closed", value: "Closed" },
  { label: "Completed", value: "Completed" },
] as const;

const formSchema = z.object({
  // project_title: z.string().min(5, {
  //   message: "Project Title must be at least 5 characters.",
  // }),
  // tags: z.array(z.string()),
  // status: z.string({ required_error: "A status is required." }),
  // date: z.string(),
  // gpsrn: z.string(),
});
const formSchema2 = z.object({
  // comments: z.string().min(10, {
  //   message: "Comments must be at least 10 characters.",
  // }),
});

export default function ProfileForm(props) {
  const [projectDetails, setProjectDetails] = useState({});
  const [remarks, setRemarks] = useState("No Remarks");
  const [category, setCategory] = useState("SOP");
  const [cgpa, setCgpa] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formatedStartDate, setFormatedStartDate] = useState("");
  const [formatedEndDate, setFormatedEndDate] = useState("");
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddSkill();
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };
  useEffect(() => {
    const response = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/student/getprojectdescription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectid: projectId,
        }),
        withCredentials: true,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProjectDetails(data);
      });
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_title: "Project Title",
    },
    mode: "onChange",
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {}
  const form2 = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
  });
  return (
    <div className="container pt-12 flex flex-col">
      <Back />
      <p className="text-center text-xl font-bold mt-10 text-red-500">
        Deadline for Applications is from {formatedStartDate} to{" "}
        {formatedEndDate}
      </p>
      <h1 className="text-5xl font-bold mb-8">Project Details</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-row gap-20 items-center justify-between md:w-1/2">
            <FormField
              control={form.control}
              name="project_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={projectDetails.project_title} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input {...field} value={projectDetails.status} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-16 items-center w-1/2 justify-between">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input {...field} value={projectDetails.date} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gpsrn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GPSRN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="GPSRN"
                      {...field}
                      value={projectDetails.gpsrn}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-16 items-center w-1/2 justify-between">
            <FormField
              control={form.control}
              name="minStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Students</FormLabel>
                  <FormControl>
                    <Input {...field} value={projectDetails.minStudents} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Students</FormLabel>
                  <FormControl>
                    <Input {...field} value={projectDetails.maxStudents} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-3">
            <FormLabel>Tags</FormLabel>
            <div className="flex flex-row gap-2">
              {projectDetails.tags &&
                projectDetails.tags.map((item) => <Badge>{item}</Badge>)}
            </div>
          </div>
          <h3>Project Description</h3>
          {projectDetails.description && (
            <Editor
              editable={false}
              initial={
                projectDetails.description
                  ? projectDetails.description
                  : [
                      {
                        type: "paragraph",
                        content: "No description available.",
                      },
                    ]
              }
            />
          )}
          <Separator />
          <div className="max-w-lg flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Student Details</h1>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="cgpa">CGPA</Label>
              <Input
                type="text"
                id="cgpa"
                placeholder="Enter your CGPA"
                onChange={(e) => setCgpa(e.target.value)}
              />
            </div>
            <div className="w-full max-w-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skill">Relevant Skills</Label>
                <div className="flex gap-2">
                  <Input
                    id="skill"
                    placeholder="Enter skills relevant to the project"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    onClick={handleAddSkill}
                    disabled={!currentSkill.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Textarea
                type="text"
                placeholder="Statement of Motivation for applying?"
                onChange={(e) => setRemarks(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Your message will be sent to the faculty of the project.
              </p>
            </div>
            <div className="max-w-[150px]">
              <Select defaultValue="SOP" onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="SOP">SOP</SelectItem>
                    <SelectItem value="DOP">DOP</SelectItem>
                    <SelectItem value="LOP">LOP</SelectItem>
                    <SelectItem value="SAT">SAT</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {new Date() >= new Date(startDate) &&
            new Date() <= new Date(endDate) && (
              // <Button
              //   onClick={async () => {
              //     try {
              //       //console.log(remarks, category);
              //       const response: any = await fetch(
              //         `${process.env.NEXT_PUBLIC_API_URL}/api/student/applyforproject`,
              //         {
              //           method: "POST",
              //           headers: {
              //             "Content-Type": "application/json",
              //           },
              //           body: JSON.stringify({
              //             projectid: projectId,
              //             remarks,
              //             category,
              //           }),
              //           withCredentials: true,
              //         }
              //       );
              //       if (response.status === 200) {
              //         toast("Successfully applied to project");
              //         router.push("/student");
              //       } else {
              //         toast("Failed to apply to project");
              //       }
              //     } catch (err) {
              //       console.log(err);
              //       toast("Failed to apply to project");
              //     }
              //   }}
              // >
              //   Apply
              // </Button>
              <Button
                onClick={async () => {
                  try {
                    // Create the formatted remarks string
                    const formattedRemarks = `CGPA: ${cgpa}\r\n\nSkills: ${skills.join(
                      ", "
                    )}\r\n\nStatement of Motivation:\r\n${remarks}`;

                    const response: any = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/student/applyforproject`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          projectid: projectId,
                          remarks: formattedRemarks, // Use the formatted string here
                          category,
                        }),
                        // withCredentials: true,
                      }
                    );
                    if (response.status === 200) {
                      toast("Successfully applied to project");
                      router.push("/student");
                    } else {
                      toast("Failed to apply to project");
                    }
                  } catch (err) {
                    console.log(err);
                    toast("Failed to apply to project");
                  }
                }}
              >
                Apply
              </Button>
            )}
          {(new Date() < new Date(startDate) ||
            new Date() > new Date(endDate)) && (
            <p className="text-center text-xl font-bold mt-10 text-red-500">
              Sorry, deadline has passed. You can't apply for this project.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
