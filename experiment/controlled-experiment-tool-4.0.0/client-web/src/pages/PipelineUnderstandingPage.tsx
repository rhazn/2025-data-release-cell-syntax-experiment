import { FC, useContext, useEffect, useState } from "react";
import { UnderstandingTask } from "../components/UnderstandingTask";
import { useNavigate } from "react-router";
import { ExperimentContext } from "../App";
import { EventType, saveTimedEvent } from "../events";
import { useLocation } from "react-router-dom";
import { Language, TaskConfig } from "../tasks/config";

interface PipelineUnderstandingPageProps {
  config: TaskConfig;
  language: Language;
  nextPage: string;
}

export const PipelineUnderstandingPage: FC<PipelineUnderstandingPageProps> = ({
  config,
  language,
  nextPage,
}: PipelineUnderstandingPageProps) => {
  const [completed, setCompleted] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(ExperimentContext);

  useEffect(() => {
    saveTimedEvent(context!.id, EventType.TASKSTART, location, {
      config,
      language,
    });
    setCompleted(false);
  }, [config]);

  return (
    <>
      {!completed && (
        <UnderstandingTask
          code={config.code[language]}
          solutionSteps={config.solutionSteps}
          stepOptions={config.optionalSteps}
          onCodeRevealed={() =>
            saveTimedEvent(
              context!.id,
              EventType.CODEREVEALED,
              location,
              config
            )
          }
          onTaskCompletion={(
            existingSteps: string[],
            optionalSteps: string[]
          ) => {
            saveTimedEvent(context!.id, EventType.TASKCOMPLETED, location, {
              existingSteps,
              optionalSteps,
              config,
            });
            setCompleted(true);
          }}
        />
      )}
      {completed && (
        <>
          <div className="bg-green-100 p-2 my-4">
            Your solution is submitted, please continue.
          </div>
          <button
            type="button"
            onClick={() => navigate(nextPage)}
            className="text-white disabled:bg-gray-400 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
          >
            Continue
          </button>
        </>
      )}
    </>
  );
};
