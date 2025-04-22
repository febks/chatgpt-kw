import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizontal } from "lucide-react";

export const inputSchema = z.object({
  userMessage: z.string().min(1, "Message is required"),
});

interface InputFormProps {
  userMessage: string;
  setUserMessage: (value: string) => void;
  handleSubmit: (values: z.infer<typeof inputSchema>) => void;
}

export const InputForm = ({
  userMessage = "",
  setUserMessage,
  handleSubmit
}: InputFormProps) => {
  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      userMessage: userMessage,
    },
  })

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full h-20 flex justify-between bg-gray-300 m-auto"
      >
        <FormField
          name="userMessage"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full h-full">
              <FormControl>
                <Input 
                  {...field}
                  placeholder="Type your message here..."
                  type="text"
                  value={userMessage}
                  onChange={(e) => {
                    field.onChange(e);
                    setUserMessage(e.target.value);
                  }}
                  className="w-full h-full outline-none border-none p-[20px] focus:border-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-[20%] md:w-[10%] h-full outline-none p-[20px] border-none font-bold cursor-pointer rounded-none"
        >
          <SendHorizontal className="size-6" />
        </Button>
      </form>
    </Form>
  )
}