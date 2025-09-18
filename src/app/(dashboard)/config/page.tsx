"use client";
import { EditIcon, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getConfig } from "@/services/configService";

interface IConfig {
  _id: string;
  globalDiscount: number;
  gst: {
    igst: number;
    cgst: number;
    sgst: number;
  };
  contactInfo: {
    phoneNumber: string;
    email: string;
    address: string;
    googleMapLink: string;
  };
}

export default function ConfigPage() {
  const [config, setConfig] = useState<IConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await getConfig();

      console.log({ response }, "config");
      setConfig(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading configuration...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={fetchConfig} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>No Configuration Found</CardTitle>
            <CardDescription>
              No configuration data is available in the system.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href={`/config/create`}>
              <Button
                variant="outline"
                className=" cursor-pointer text-black font-semibold"
              >
                <Plus className="w-4 h-4 text-green-500" /> ADD
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Configuration</h1>
          <p className="text-muted-foreground">
            View and manage your application settings
          </p>
        </div>
        <Link href={`/config/edit/${config._id}?type=config`}>
          <Button variant="outline" className=" cursor-pointer text-white">
            <EditIcon className="w-4 h-4 text-blue-500" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Global Discount Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Global Discount
              <Badge variant="secondary">{config.globalDiscount}%</Badge>
            </CardTitle>
            <CardDescription>
              The default discount percentage applied across the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-primary">
              {config.globalDiscount}%
            </div>
          </CardContent>
        </Card>

        {/* GST Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>GST Configuration</CardTitle>
            <CardDescription>
              Goods and Services Tax rates for different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  IGST (Integrated GST)
                </div>
                <div className="text-xl font-semibold flex items-center gap-2">
                  {config.gst.igst}%<Badge variant="outline">Interstate</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  CGST (Central GST)
                </div>
                <div className="text-xl font-semibold flex items-center gap-2">
                  {config.gst.cgst}%<Badge variant="outline">Central</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  SGST (State GST)
                </div>
                <div className="text-xl font-semibold flex items-center gap-2">
                  {config.gst.sgst}%<Badge variant="outline">State</Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">
                Total GST Rate (CGST + SGST):{" "}
                <span className="font-medium">
                  {config.gst.cgst + config.gst.sgst}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
            <CardDescription>
              The information will be used by users to contact Dutz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </p>
                <a
                  href={`tel:${config.contactInfo.phoneNumber}`}
                  className="text-lg font-semibold"
                >
                  {config.contactInfo.phoneNumber}
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${config.contactInfo.email}`}
                  className="text-lg font-semibold"
                >
                  {config.contactInfo.email}
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <p className="text-lg font-semibold">
                  {config.contactInfo.address}
                </p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className=" font-medium text-muted-foreground">Location</p>
                <div className=" w-full">
                  <iframe
                    allowFullScreen={true}
                    className="h-90 w-full rounded-lg border-0 shadow-md"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={config.contactInfo.googleMapLink}
                    title="The Dutz location on Google Maps"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
