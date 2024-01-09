import { DataTable } from "~/components/ui/data-table";
import { trpc } from "~/trpc";
import { columns } from "./hackathon-columns";

export function displayHackathons() {
  return <HackathonsTable></HackathonsTable>;
}

export function HackathonsTable() {
  const {
    data: hackathons,
    isLoading,
    error,
  } = trpc.hackathons.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={columns} data={hackathons} />;
}
