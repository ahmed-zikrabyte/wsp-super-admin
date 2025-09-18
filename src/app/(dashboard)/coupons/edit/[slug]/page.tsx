"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// Zod schema for coupon validation
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getCouponByCode, updateCoupon } from "@/services/couponService";

const couponFormSchema = z
  .object({
    code: z
      .string()
      .min(1, { message: "Coupon code is required." })
      .transform((val) => val.toUpperCase().trim()),
    discountType: z
      .enum(["percentage"], {
        message: 'Invalid discount type. Must be "percentage".',
      })
      .default("percentage"),
    discountValue: z.coerce
      .number()
      .min(1, { message: "Discount value must be at least 1." })
      .max(100, { message: "Discount value cannot exceed 100." }),
    minPurchaseAmount: z.coerce
      .number()
      .min(0, { message: "Minimum purchase amount cannot be negative." })
      .default(0),
    startDate: z.coerce
      .date()
      .refine((date) => !!date, { message: "Start date is required." }),
    expiresAt: z.coerce
      .date()
      .refine((date) => !!date, { message: "Expiration date is required." }),
    status: z.enum(["active", "inactive"]).default("inactive"),
  })
  .refine((data) => data.expiresAt > data.startDate, {
    message: "Expiration date must be after the start date.",
    path: ["expiresAt"],
  });

type CouponFormValues = z.infer<typeof couponFormSchema>;

export default function CouponForm() {
  const [coupon, setCoupon] = useState<CouponFormValues | null>(null);
  const router = useRouter();
  const { slug } = useParams();
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await getCouponByCode(slug as string);
        setCoupon(response.data);
      } catch (error) {
        console.error("Error fetching coupon:", error);
      }
    };
    fetchCoupon();
  }, [slug]);

  useEffect(() => {
    if (coupon) {
      form.reset(coupon);
    }
  }, [coupon]);

  const form = useForm<any>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 1,
      minPurchaseAmount: 0,
      startDate: new Date(),
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Default to 1 year from now
      status: "inactive",
    },
  });

  async function onSubmit(data: CouponFormValues) {
    try {
      const response = await updateCoupon(slug as string, data);
      console.log(response.data);
      router.push("/coupons?type=true");
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Coupon</CardTitle>
        <CardDescription>
          Fill in the details to edit a discount coupon.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SUMMER20" {...field} />
                    </FormControl>
                    <FormDescription>
                      The unique code customers will use. Will be converted to
                      uppercase.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 15" {...field} />
                    </FormControl>
                    <FormDescription>
                      The percentage discount (1-100).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minPurchaseAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Purchase Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormDescription>
                      The minimum order value for the coupon to be valid.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date from which the coupon becomes active.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        {/* <Calendar
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        /> */}
                        <Calendar
                          disabled={(date) => {
                            const startDate = form.getValues("startDate");
                            // If no startDate yet → disable everything
                            if (!startDate) return true;

                            // If startDate exists → disable all before startDate
                            return date < startDate;
                          }}
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date when the coupon will expire.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end cursor-pointer">
              <Button
                disabled={form.formState.isSubmitting}
                className="bg-black cursor-pointer text-white"
                type="submit"
              >
                {form.formState.isSubmitting ? "Updating..." : "Update Coupon"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
