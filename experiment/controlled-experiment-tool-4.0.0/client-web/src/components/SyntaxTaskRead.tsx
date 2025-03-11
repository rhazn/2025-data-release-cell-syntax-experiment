import { useState } from "react";
import { HighlightedTable } from "./HighlightedTable";
import { Language } from "../tasks/configSyntax";

interface SyntaxTaskReadProps {
  language: Language;
  code: string;
  tableData: (string | number)[][];
  onTaskCompletion: (solution: number[][]) => void;
}

export const SyntaxTaskRead: React.FC<SyntaxTaskReadProps> = ({
  language,
  code,
  tableData,
  onTaskCompletion,
}: SyntaxTaskReadProps) => {
  const [solution, setSolution] = useState<number[][]>([]);

  const submitSolution = () => {
    if (!solution) {
      return;
    }

    onTaskCompletion(solution);
  };

  return (
    <>
      <h1 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 ">
        Task: Understand Cell Selection
      </h1>
      <div className="flex flex-row flex-nowrap mb-4">
        <div className="flex flex-col flex-1 justify-center self-start">
          <h2 className="my-2 text-2xl tracking-tight font-bold text-gray-900">
            1. Read {language == "jv" ? "Jayvee" : "Python"} code to select
            cells
          </h2>
          <p className="mb-10 font-bold border-b-2 border-black">
            Please read the code and understand what cells it will select.
          </p>
          <div className="flex flex-row flex-nowrap items-baseline">
            <pre className="text-left">{code}</pre>
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-center self-start">
          <h2 className="my-2 text-2xl tracking-tight font-bold text-gray-900">
            2. Highlight data
          </h2>
          <p className="mb-10 font-bold border-b-2 border-black">
            Highlight the subset of data that the code selects with{" "}
            <p className="bg-blue-300 inline">blue</p> using clicks or click and
            dragging.
          </p>
          <HighlightedTable
            editable={true}
            onHighlightChange={setSolution}
            showHeader={false}
            header={[
              "name",
              "mpg",
              "cyl",
              "disp",
              "hp",
              "drat",
              "wt",
              "qsec",
              "vs",
              "am",
              "gear",
              "carb",
            ]}
            data={tableData}
          />
          <h2 className="mt-10 mb-4 py-4 text-2xl tracking-tight font-bold text-gray-900 border-t-2 border-black">
            3. Submit Solution
          </h2>
          <div className="mt-2 mb-10">
            <button
              type="button"
              disabled={!solution}
              onClick={() => submitSolution()}
              className="text-white disabled:bg-gray-400 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
            >
              {!solution ? "Enter a solution first" : "Submit Solution"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
