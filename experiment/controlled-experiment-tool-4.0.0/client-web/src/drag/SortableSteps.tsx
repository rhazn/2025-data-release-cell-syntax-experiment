import { FC, useEffect, useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import SortableContainer from "./SortableContainer";
import { Item } from "./SortableItem";

export interface SortableStepsProps {
    existingSteps?: string[];
    optionalSteps: string[];
    onStepsChanged: (existingSteps: string[], optionalSteps: string[]) => void;
    disabled?: boolean;
}

export const SortableSteps: FC<SortableStepsProps> = ({
    existingSteps,
    optionalSteps,
    onStepsChanged,
    disabled,
}: SortableStepsProps) => {
    const [items, setItems] = useState<{ [containerName: string]: string[] }>({
        existingSteps: existingSteps || [],
        optionalSteps: optionalSteps,
    });
    const [activeId, setActiveId] = useState<string | null>();

    useEffect(() => {
        onStepsChanged(items.existingSteps, items.optionalSteps);
    }, [items]);

    const sensor = useSensors(useSensor(PointerSensor));

    const findContainer = (id: string) => {
        if (id in items) {
            return id;
        }

        return Object.keys(items).find((key) => items[key].includes(id));
    };

    const handleDragStart = (event: { active: any }) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event: { active: any; over: any }) => {
        const { active, over } = event;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            const activeIndex = activeItems.indexOf(active.id);
            const overIndex = overItems.indexOf(over.id);

            let newIndex;
            if (over.id in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem =
                    over && overIndex === overItems.length - 1;

                const modifier = isBelowLastItem ? 1 : 0;

                newIndex =
                    overIndex >= 0
                        ? overIndex + modifier
                        : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter(
                        (item: any) => item !== active.id
                    ),
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    items[activeContainer][activeIndex],
                    ...prev[overContainer].slice(
                        newIndex,
                        prev[overContainer].length
                    ),
                ],
            };
        });
    };

    const handleDragEnd = (event: { active: any; over: any }) => {
        const { active, over } = event;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer !== overContainer
        ) {
            return;
        }

        const activeIndex = items[activeContainer].indexOf(active.id);
        const overIndex = items[overContainer].indexOf(over.id);

        if (activeIndex !== overIndex) {
            setItems((items) => ({
                ...items,
                [overContainer]: arrayMove(
                    items[overContainer],
                    activeIndex,
                    overIndex
                ),
            }));
        }

        setActiveId(null);
    };

    return (
        <div className="flex flex-col min-w-[400px]">
            <DndContext
                sensors={sensor}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <h2 className="mb-4 text-2xl tracking-tight text-gray-900">
                    Steps in Data Pipeline
                </h2>
                <SortableContainer
                    id="existingSteps"
                    items={items.existingSteps}
                    disabled={disabled}
                />
                <h2 className="mb-4 text-2xl tracking-tight text-gray-900">
                    Unused Steps
                </h2>
                <SortableContainer
                    id="optionalSteps"
                    items={items.optionalSteps}
                    disabled={disabled}
                />
                <DragOverlay>
                    {activeId ? <Item id={activeId} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};
