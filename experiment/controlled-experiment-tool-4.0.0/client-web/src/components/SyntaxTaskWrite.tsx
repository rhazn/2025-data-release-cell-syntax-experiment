import { useState } from "react";
import { HighlightedTable } from "./HighlightedTable";
import { Language } from "../tasks/configSyntax";

interface SyntaxTaskWriteProps {
  language: Language;
  surroundingCode: {
    codeBefore: string;
    codeAfter: string;
    lineBefore: string;
    lineAfter: string;
  };
  tableData: (string | number)[][];
  highlightStart: number[];
  highlightEnd: number[];
  onTaskCompletion: (solution: string) => void;
}

export const SyntaxTaskWrite: React.FC<SyntaxTaskWriteProps> = ({
  language,
  surroundingCode,
  tableData,
  highlightStart,
  highlightEnd,
  onTaskCompletion,
}: SyntaxTaskWriteProps) => {
  const [solution, setSolution] = useState<string>("");

  const submitSolution = () => {
    if (!solution) {
      return;
    }

    onTaskCompletion(solution);
  };

  return (
    <>
      <h1 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 ">
        Task: Write Cell Selection Code
      </h1>
      <div className="flex flex-row flex-nowrap mb-4">
        <div className="flex flex-1 justify-center self-start flex-col">
          <h2 className="my-2 text-2xl tracking-tight font-bold text-gray-900">
            1. Look at data
          </h2>
          <p className="mb-10 font-bold border-b-2 border-black">
            Please look at the data and notice the subset of cells that are
            highlighted in <p className="bg-blue-300 inline">blue</p>.
          </p>
          <HighlightedTable
            editable={false}
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
            highlightStart={highlightStart}
            highlightEnd={highlightEnd}
          />
        </div>
        <div className="flex flex-col flex-1 justify-center self-start">
          <h2 className="my-2 text-2xl tracking-tight font-bold text-gray-900">
            2. Complete {language == "jv" ? "Jayvee" : "Python"} code to select
            cells
          </h2>
          <p className="mb-10 font-bold border-b-2 border-black">
            Please complete the code to select the subset of data that is
            highlighted on the left.
          </p>
          <div className="p-4">
            <pre className="text-left">{surroundingCode.codeBefore}</pre>
            <div className="flex flex-row flex-nowrap items-baseline">
              <pre>{surroundingCode.lineBefore}</pre>
              <input
                className="border-blue-600 border-2"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                type="text"
              />
              <pre>{surroundingCode.lineAfter}</pre>
            </div>
            <pre className="text-left">{surroundingCode.codeAfter}</pre>
          </div>
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
