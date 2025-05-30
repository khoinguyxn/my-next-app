import {cn} from "@/lib/utils"
import {ComponentProps} from "react";

function Skeleton({className, children, ...props}: ComponentProps<"div">) {
    return (<div
        data-slot="skeleton"
        className={cn("bg-accent animate-pulse rounded-md", className)}
        {...props}
    >{children}</div>)
}

export {Skeleton}
