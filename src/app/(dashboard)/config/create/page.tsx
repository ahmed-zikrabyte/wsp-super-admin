"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { createConfig } from "@/services/configService";

// Zod schema matching the IConfig interface
const configSchema = z.object({
  globalDiscount: z
    .number()
    .min(0, "Global discount must be non-negative")
    .max(100, "Global discount cannot exceed 100%"),
  gst: z.object({
    igst: z
      .number()
      .min(0, "IGST must be non-negative")
      .max(100, "IGST cannot exceed 100%"),
    cgst: z
      .number()
      .min(0, "CGST must be non-negative")
      .max(100, "CGST cannot exceed 100%"),
    sgst: z
      .number()
      .min(0, "SGST must be non-negative")
      .max(100, "SGST cannot exceed 100%"),
  }),
  contactInfo: z.object({
    phoneNumber: z
      .string()
      .regex(/^[6-9][0-9*#]{9}$/, "Enter a valid 10-digit Indian mobile number")
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits"),

    email: z
      .string()
      .min(1, "Email cannot be empty")
      .email("Enter a valid email address"),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters long")
      .max(200, "Address cannot exceed 200 characters"),

    googleMapLink: z
      .string()
      .url("Enter a valid Google Maps link")
      .regex(
        /^https?:\/\/(www\.)?google\.[a-z.]+\/maps/i,
        "Enter a valid Google Maps URL"
      ),
  }),
});

export type ConfigFormValues = z.infer<typeof configSchema>;

export default function ConfigForm() {
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      globalDiscount: 0,
      gst: {
        igst: 0,
        cgst: 0,
        sgst: 0,
      },
      contactInfo: {
        phoneNumber: "",
        email: "",
        address: "",
        googleMapLink: "",
      },
    },
  });

  async function onSubmit(data: ConfigFormValues) {
    try {
      // Here you would typically send the data to your API

      const response = await createConfig(data);

      console.log(response, "Reskjgsfg");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
        <CardDescription>
          Configure global discount and GST rates for your system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Global Discount Field */}
            <FormField
              control={form.control}
              name="globalDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Global Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      className="w-sm"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Set the global discount percentage (0-100%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GST Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">GST Configuration</h3>
              <div className="grid grid-cols-3 gap-10">
                <FormField
                  control={form.control}
                  name="gst.igst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IGST (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Integrated Goods and Services Tax rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gst.cgst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CGST (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Central Goods and Services Tax rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gst.sgst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SGST (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        State Goods and Services Tax rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <p className="text-lg mb-4">Contact Info</p>
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="contactInfo.phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder=""
                          {...field}
                          min={10}
                          onChange={(e) => {
                            if (e.target.value.length <= 10)
                              field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder=""
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder=""
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo.googleMapLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Map Link</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder=""
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="max-w-56">
                Save Configuration
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
