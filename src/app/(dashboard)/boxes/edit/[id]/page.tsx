"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getBoxById, updateBox } from "@/services/boxService";

// Define the Zod schema based on your Mongoose schema
const boxFormSchema = z.object({
  label: z.string().min(1, "Label is required.").trim(),
  length: z.number().min(0, "Length must be a positive number."),
  breadth: z.number().min(0, "Breadth must be a positive number."),
  height: z.number().min(0, "Height must be a positive number."),
  boxWeight: z.number().min(0, "Box weight must be a positive number."),
  itemCountRange: z
    .object({
      min: z.number().min(1, "Min items must be at least 1."),
      max: z.number().min(1, "Max items must be at least 1."),
    })
    .refine((data) => data.min <= data.max, {
      message: "Min items cannot be greater than Max items.",
      path: ["min"], // error will be shown under "min" field
    }),
});

export default function BoxForm() {
  const { id } = useParams<{ id: string }>();
  console.log("params", id);

  useEffect(() => {
    const fetchBox = async () => {
      try {
        const response = await getBoxById(id as string);
        form.reset(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBox();
  }, [id]);
  const router = useRouter();
  const form = useForm<z.infer<typeof boxFormSchema>>({
    resolver: zodResolver(boxFormSchema),
    defaultValues: {
      label: "",
      length: 0,
      breadth: 0,
      height: 0,
      boxWeight: 0,
      itemCountRange: {
        min: 1,
        max: 3,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof boxFormSchema>) {
    try {
      const response = await updateBox(id, values);
      if (response.success) {
        toast.success(response.message);
        setTimeout(() => {
          router.push("/boxes?type=boxes");
        }, 1200);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  }

  return (
    <Card className="w-full  mx-auto">
      <CardHeader>
        <CardTitle>Edit Box</CardTitle>
        <CardDescription>
          Define the dimensions and properties of a box.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control as any}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Small Box, Medium Box"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters and spaces
                        if (/^[A-Za-z\s]*$/.test(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.valueAsNumber))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="breadth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breadth (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.valueAsNumber))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.valueAsNumber))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="boxWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Box Weight (g)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.valueAsNumber))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Item Count Range</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="itemCountRange.min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Min Items</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Min Items"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.valueAsNumber))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="itemCountRange.max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Max Items</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Max Items"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.valueAsNumber))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* {form.formState.errors.itemCountRange?.min && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.itemCountRange.min.message}
                </p>
              )} */}
            </div>
            <CardFooter className="p-0 pt-4 flex justify-end">
              <Button type="submit" className="">
                Update
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
