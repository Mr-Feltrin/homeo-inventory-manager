import React, { useState } from "react";
import ImageIcon from "../Icons/ImageIcon";

type TableRowImageProps = {
    src: string;
} & React.HTMLAttributes<HTMLDivElement>;

const TableRowImage = ({ src, ...props }: TableRowImageProps) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div {...props} className={props.className ?? "w-8 h-8 me-2"}>
            <img className="w-full h-full rounded-md" style={{ display: isLoading ? "none" : "block" }} src={src} onLoad={() => setIsLoading(false)} />
            {isLoading && <ImageIcon className="w-7 h-7 animate-pulse" />}
        </div>
    );
};

export default TableRowImage;
