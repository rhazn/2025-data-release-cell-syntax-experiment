import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./SortableItem";

export default function SortableContainer({
    id,
    items,
    disabled,
}: {
    id: string;
    items: string[];
    disabled?: boolean;
}) {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <SortableContext
            id={id}
            disabled={disabled}
            items={items}
            strategy={verticalListSortingStrategy}
        >
            <div className="p-2 m-2 bg-gray-400 flex-1" ref={setNodeRef}>
                {items.map((id: string) => (
                    <SortableItem key={id} id={id} />
                ))}
            </div>
        </SortableContext>
    );
}
