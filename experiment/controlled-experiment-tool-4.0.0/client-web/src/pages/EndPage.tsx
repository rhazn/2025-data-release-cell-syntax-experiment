import { FC } from "react";

interface EndPageProps {}

export const EndPage: FC<EndPageProps> = ({}: EndPageProps) => {
  return (
    <div className="max-w-xl text-left">
      <h1 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 ">
        Thank you!
      </h1>
      <p className="mb-4 font-light">Thank you for completing the tasks.</p>
      <p className="mb-4 font-light">
        Finally, please fill out{" "}
        <a
          className="text-blue-600"
          target="_blank"
          href="https://oss.cs.fau.de/surveys/index.php/727138?lang=en"
        >
          this short survey about your experience.
        </a>
      </p>
    </div>
  );
};
