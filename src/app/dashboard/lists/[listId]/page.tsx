import ListDetailsPage from "@/features/dashboard/pages/lists/list-details-page";

export default function Page({ params }: { params: { listId: string } }) {
    return <ListDetailsPage listId={params.listId} />;
}
