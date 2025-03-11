import { FC, useState } from "react";
import { useNavigate } from "react-router";

interface SyntaxConsentPageProps {}

export const SyntaxConsentPage: FC<
  SyntaxConsentPageProps
> = ({}: SyntaxConsentPageProps) => {
  const [consent, setConsent] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="max-w-xl text-left">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 py-4">
        Experiment Consent
      </h1>
      <p className="mb-4 font-light py-4">
        Thank you for participating in a controlled experiment to investigate
        the effect of using sheet software syntax to make selection in tables.
        During the experiment, you will be asked to perform tasks using a
        specific language, either Jayvee 0.5.0 or Python 3.11 with Pandas 2.0.
      </p>
      <p className="mb-4 font-light py-4">
        Your participation is voluntary, and all data collected will be treated
        confidentially.{" "}
        <b>
          Participation has no effect on grading for MADE. You can stop
          participating in the experiment at any time without adverse effects.
        </b>{" "}
        The results obtained may contribute to advancements in data engineering
        practices.
      </p>
      <div className="flex items-center mb-4 py-4">
        <input
          id="consent-accept"
          onChange={() => setConsent(!consent)}
          type="checkbox"
          value=""
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
        />
        <label
          htmlFor="consent-accept"
          className="ml-2 text-sm font-medium text-gray-900 "
        >
          I have read and understand the consent form and wish to participate in
          the experiment.
        </label>
      </div>
      <button
        type="button"
        onClick={() => navigate("/prepareSyntax")}
        className="text-white disabled:bg-gray-400 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
      >
        Continue
      </button>
    </div>
  );
};
