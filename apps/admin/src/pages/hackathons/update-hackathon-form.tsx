import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { RouterOutput } from "@knighthacks/api";
import { insertHackathonSchema } from "@knighthacks/db";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { trpc } from "~/trpc";

type Hackathon = RouterOutput["hackathons"]["getAll"][number];

const updateHackathonFormSchema = insertHackathonSchema.omit({ id: true });

type UpdateHackathonFormValues = z.infer<typeof updateHackathonFormSchema>;

export function UpdateHackathonForm({ hackathon }: { hackathon: Hackathon }) {
  const utils = trpc.useUtils();

  const form = useForm<UpdateHackathonFormValues>({
    resolver: zodResolver(updateHackathonFormSchema),
    defaultValues: {
      name: hackathon.name,
      startDate: hackathon.startDate,
      endDate: hackathon.endDate,
    },
  });
  const { mutate, isLoading } = trpc.hackathons.updateHackathon.useMutation({
    onSuccess: async () => {
      await utils.hackathons.getAll.invalidate();
      toast("Success!", {
        description: "Hackathon updated",
      });
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<UpdateHackathonFormValues> = (values) => {
    mutate({
      id: hackathon.id,
      ...values,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hackathon Name</FormLabel>
              <FormControl>
                <Input placeholder="Hackathon Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input placeholder="Start Date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input placeholder="End Date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Update Hackathon
        </Button>
      </form>
    </Form>
  );
}
