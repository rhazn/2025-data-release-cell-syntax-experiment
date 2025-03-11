import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC } from "react";

export const Item: FC<{ id: string }> = ({ id }: { id: string }) => {
    return (
        <div className="w-full my-4 flex items-center content-center border-solid bottom-2 p-2 bg-white">
            {id}
        </div>
    );
};

export const SortableItem = ({ id }: { id: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Item id={id} />
        </div>
    );
};
