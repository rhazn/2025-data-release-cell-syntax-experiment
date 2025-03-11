import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ExperimentContext } from "../App";
import { EventType, saveTimedEvent } from "../events";
import { useLocation } from "react-router-dom";
import {
  Language,
  TaskConfig,
  TaskConfigSyntaxRead,
  TaskConfigSyntaxWrite,
} from "../tasks/configSyntax";
import { SyntaxTaskWrite } from "../components/SyntaxTaskWrite";
import { SyntaxTaskRead } from "../components/SyntaxTaskRead";

interface TaskPageProps {
  config: TaskConfig;
  language: Language;
  nextPage: string;
}

export const TaskPage: FC<TaskPageProps> = ({
  config,
  language,
  nextPage,
}: TaskPageProps) => {
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

  let taskElement;
  let data;
  switch (config.type) {
    case "SYNTAX_WRITE":
      // eslint-disable-next-line no-case-declarations
      data = config.data as unknown as TaskConfigSyntaxWrite;
      taskElement = (
        <SyntaxTaskWrite
          language={language}
          surroundingCode={data[language].surroundingCode}
          tableData={data.tableData}
          highlightStart={data.highlightStart}
          highlightEnd={data.highlightEnd}
          onTaskCompletion={(solution: string) => {
            saveTimedEvent(context!.id, EventType.TASKCOMPLETED, location, {
              solution,
              config,
            });
            setCompleted(true);
          }}
        />
      );
      break;
    case "SYNTAX_READ":
      // eslint-disable-next-line no-case-declarations
      data = config.data as unknown as TaskConfigSyntaxRead;
      taskElement = (
        <SyntaxTaskRead
          language={language}
          code={data[language].code}
          tableData={data.tableData}
          onTaskCompletion={(solution: number[][]) => {
            saveTimedEvent(context!.id, EventType.TASKCOMPLETED, location, {
              solution,
              config,
            });
            setCompleted(true);
          }}
        />
      );
      break;
  }

  return (
    <>
      {!completed && taskElement}
      {completed && (
        <>
          <div className="bg-green-100 p-2 my-4">
            Your solution is submitted.
          </div>
          <div className="p-2 my-4">
            Once you are ready for your next task, please click on continue.
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
