import { FC, useState } from "react";

interface ExperimentMetadataInputPageProps {
  onSubmitMetaData: (experimentId: string, group: "AB" | "BA") => void;
}

export const ExperimentMetadataInputPage: FC<
  ExperimentMetadataInputPageProps
> = ({ onSubmitMetaData }: ExperimentMetadataInputPageProps) => {
  const [experimentId, setExperimentId] = useState<string>("");
  const [group] = useState<"AB" | "BA">(Math.random() < 0.5 ? "AB" : "BA");

  return (
    <div className="max-w-xl text-left">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 py-4">
        Experiment Setup
      </h1>
      <p className="mb-4 font-light py-4">
        To start the experiment, please enter an experiment id.
      </p>
      <div className="mb-4 py-4">
        <form
          className="flex-column"
          onSubmit={(e) => {
            e.preventDefault();
            if (experimentId && group) {
              onSubmitMetaData(experimentId, group);
            }
          }}
        >
          <div className="flex items-center pb-8">
            <div>
              <label
                htmlFor="experiment-id"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                Experiment ID
              </label>
              <input
                id="experiment-id"
                onChange={(e) => setExperimentId(e.target.value)}
                type="text"
                value={experimentId}
                className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
              />
            </div>
            <div>
              <label
                htmlFor="experiment-id"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                Experiment Group
              </label>
              <input
                id="experiment-group"
                type="text"
                value={group}
                disabled={true}
                className="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!experimentId}
            className="text-white disabled:bg-gray-400 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};
