import { useEffect, useState } from "react";
import { SortableSteps } from "../drag/SortableSteps";
import { SourceCode } from "./SourceCode";

interface UnderstandingTaskProps {
  code: string;
  solutionSteps: string[];
  stepOptions: string[];
  onCodeRevealed: () => void;
  onTaskCompletion: (existingSteps: string[], optionalSteps: string[]) => void;
}

export const UnderstandingTask: React.FC<UnderstandingTaskProps> = ({
  code,
  stepOptions,
  onCodeRevealed,
  onTaskCompletion,
}: UnderstandingTaskProps) => {
  const [existingSteps, setExistingSteps] = useState<string[]>([]);
  const [optionalSteps, setOptionalSteps] = useState<string[]>(stepOptions);
  const [showCode, setShowCode] = useState<boolean>(false);

  useEffect(() => {
    if (showCode) {
      onCodeRevealed();
    }
  }, [showCode]);

  const submitSolution = () => {
    if (!existingSteps) {
      return;
    }

    onTaskCompletion(existingSteps, optionalSteps);
  };

  return (
    <>
      <h1 className="my-2 text-4xl tracking-tight font-bold text-gray-900 ">
        Understanding Data Pipelines
      </h1>
      <p className="my-2 font-light py-4">
        Please bring the steps on the right in the order they appear in the data
        pipeline code on the left. To do so, drag the steps into the "Steps in
        Data Pipeline" container. Leave any steps that do not appear in the
        pipeline code in the "Unused Steps" container.
      </p>
      <div className="flex flex-row flex-nowrap my-2 max-w-full">
        <div className="flex-2 align-left overflow-scroll flex-grow self-stretch">
          <h2 className="my-2 text-2xl tracking-tight font-bold text-gray-900">
            Pipeline Code
          </h2>
          {!showCode && (
            <>
              <p className="my-2 font-light">
                First, read the available pipeline steps shown on the right.
              </p>
              <p className="my-2 font-light py-4">
                Afterwards, click on 'Show Code' and start the task.
              </p>
              <button
                type="button"
                onClick={() => setShowCode(true)}
                className="text-white disabled:bg-gray-400 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
              >
                Show Code
              </button>
            </>
          )}
          {showCode && <SourceCode code={code} />}
        </div>
        <div className="flex flex-col flex-1 justify-center self-start top-8 max-w-sm">
          <h2 className="my-2 text-2xl tracking-tight font-bold text-gray-900">
            Pipeline Steps
          </h2>
          <div className="my-2">
            <button
              type="button"
              disabled={!showCode || existingSteps.length == 0}
              onClick={() => submitSolution()}
              className="text-white disabled:bg-gray-400 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
            >
              {!showCode ? "Reveal Code First" : "Submit Solution"}
            </button>
          </div>
          <SortableSteps
            disabled={!showCode}
            existingSteps={existingSteps}
            optionalSteps={optionalSteps}
            onStepsChanged={(existingSteps, optionalSteps) => {
              setExistingSteps(existingSteps);
              setOptionalSteps(optionalSteps);
            }}
          />
        </div>
      </div>
    </>
  );
};
