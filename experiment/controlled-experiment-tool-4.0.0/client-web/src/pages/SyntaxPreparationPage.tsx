import { FC, useState } from "react";
import { useNavigate } from "react-router";

interface SyntaxPreparationPageProps {}

export const SyntaxPreparationPage: FC<
  SyntaxPreparationPageProps
> = ({}: SyntaxPreparationPageProps) => {
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");

  return (
    <div className="max-w-xl text-left">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 py-4">
        Preparation
      </h1>
      <h2 className="mb-2 text-l font-bold text-gray-900 py-2">
        During the task, you can use the following documentation websites:
      </h2>
      <ul className="list-disc py-2">
        <li>
          <a
            className="text-blue-500"
            target="_blank"
            href="https://pandas.pydata.org/docs/user_guide/indexing.html#selection-by-position"
          >
            Pandas selection by position
          </a>
        </li>
        <li>
          <a
            className="text-blue-500"
            target="_blank"
            href="https://jvalue.github.io/jayvee/docs/user/cell-range"
          >
            Jayvee 0.5.0 cell range documentation
          </a>
        </li>
      </ul>
      <p className="mb-2 font-light py-2">
        You can open them in the background by clicking on all links now.{" "}
        <b>
          Please do not use any other resources, websites or search
          functionality of your browser.
        </b>
      </p>
      <h2 className="mb-2 text-l font-bold text-gray-900 py-2">
        You will be asked to solve tasks, with the following guidelines:
      </h2>
      <ul className="mb-2 list-disc py-2">
        <li>
          You do not need to talk about your thought process and the experiment
          host is not going to interact with you or answer questions while you
          attempt to solve the task
        </li>
        <li>
          When you think your solution is correct, please press the "Submit
          Solution" button
        </li>
        <li>
          We measure the time it takes you to solve a task and the correctness
          of your solution. If you are unsure if your solution is correct,
          please <b>favor correctness above speed</b> and try to solve the task
          as correctly as possible
        </li>
      </ul>
      <p className="py-2">Task Password:</p>
      <input type="text" onChange={(e) => setInput(e.target.value)}></input>
      <p className="py-2">
        Please do not continue until being told to, once you click continue the
        tasks will start.
      </p>
      <button
        type="button"
        disabled={input.toLowerCase() !== "made24"}
        onClick={() => navigate("/s/0")}
        className="text-white disabled:bg-gray-400 bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
      >
        Continue
      </button>
    </div>
  );
};
