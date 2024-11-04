export type TableHeader = {
    title: string;
    selector: string;
    imageSelector?: string;
    showSorting?: boolean;
    highlight?: boolean;
    defaultValue?: string;
}[];