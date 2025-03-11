import type { Location } from "@remix-run/router";
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_BACKEND_HOST);
pb.autoCancellation(false);

export enum EventType {
    EXPERIMENTSTART = "EXPERIMENTSTART",
    PAGEENTER = "PAGEENTER",
    TASKSTART = "TASKSTART",
    CODEREVEALED = "CODEREVEALED",
    TASKERROR = "TASKERROR",
    TASKCOMPLETED = "TASKCOMPLETED",
}

interface TimedEvent {
    experiment: string;
    type: EventType;
    location: string;
    context: string;
    time: number;
}

export const saveTimedEvent = async (
    experimentId: string,
    type: EventType,
    location: Location,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any
): Promise<void> => {
    const event: TimedEvent = {
        experiment: experimentId,
        type,
        location: JSON.stringify(location),
        context: JSON.stringify(context),
        time: performance.now(),
    };

    console.log(JSON.stringify(event));

    const record = await pb.collection("events").create(event);

    console.log(JSON.stringify(record));

    return;
};
