"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import NavBar from "@/components/ui/nav-bar";
import { Textarea } from "@/components/ui/textarea";
import { createFaqs } from "@/services/faqService";

// ✅ Zod schema for validation
const faqSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question must be at most 200 characters"),
  answer: z
    .string()
    .min(5, "Answer must be at least 5 characters")
    .max(500, "Answer must be at most 500 characters"),
});

type FAQType = z.infer<typeof faqSchema>;

const Page = () => {
  const form = useForm<FAQType>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const onSubmit = async (data: FAQType) => {
    console.log("Form Submitted ✅", data);
    // 👉 here you can call API to save FAQ
    const response = await createFaqs(data);
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    form.reset(); // clear form after submit
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Navbar */}
      <NavBar label="Create FAQs" />

      {/* Form Card */}
      <Card className="mx-auto w-full max-w-2xl rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Add a New FAQ</CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="flex flex-col gap-6">
              {/* Question */}
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a question"
                        {...field}
                        className="rounded-lg border-gray-300 focus:border-black focus:ring-2 focus:ring-black/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Answer */}
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter an answer"
                        {...field}
                        className="rounded-lg border-gray-300 focus:border-black focus:ring-2 focus:ring-black/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="rounded-lg bg-black px-6 py-2 text-white hover:bg-black/80"
              >
                {form.formState.isSubmitting ? "Adding..." : "Add"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Page;
