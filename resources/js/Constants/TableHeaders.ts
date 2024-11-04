import { TableHeader } from "@/types/TableHeader";

export const containerTableHeaders: TableHeader = [
    { title: "Name", selector: "name", imageSelector: "image", showSorting: true },
    { title: "Details", selector: "details", showSorting: true, defaultValue: "No details provided" },
    { title: "Number of Items", selector: "total_items", showSorting: true },
    { title: "Room Name", selector: "room_name", showSorting: true },
    { title: "Created At", selector: "created_at", showSorting: true },
    { title: "Last Update", selector: "updated_at", showSorting: true }
];

export const itemTableHeaders: TableHeader = [
    { title: "Name", selector: "name", imageSelector: "image", showSorting: true },
    { title: "Details", selector: "details", showSorting: true, defaultValue: "No details provided" },
    { title: "Amount", selector: "amount", showSorting: true, highlight: true },
    { title: "Category", selector: "category_name", showSorting: true },
    { title: "Room", selector: "room_name", showSorting: true },
    { title: "Container", selector: "container_name", showSorting: true },
    { title: "Last Update", selector: "updated_at", showSorting: true }
];

export const categoryTableHeaders: TableHeader = [
    { title: "Name", selector: "name", showSorting: true },
    { title: "Created At", selector: "created_at", showSorting: true },
    { title: "Last Update", selector: "updated_at", showSorting: true }
];
