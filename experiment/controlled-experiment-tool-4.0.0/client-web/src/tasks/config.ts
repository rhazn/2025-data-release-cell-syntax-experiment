import * as task0 from "../tasks/task0.txt?raw";
import * as task1JV from "../tasks/task1.jv?raw";
import * as task1PY from "../tasks/task1.py?raw";
import * as task2JV from "../tasks/task2.jv?raw";
import * as task2PY from "../tasks/task2.py?raw";

export type Language = "jv" | "py";
export type Group = "AB" | "BA";

export interface TaskConfig {
  code: { jv: string; py: string };
  solutionSteps: string[];
  optionalSteps: string[];
}
const taskConfigs: TaskConfig[] = [
  {
    code: { jv: task0.default, py: task0.default },
    solutionSteps: ["Step 2", "Step 8", "Step 3", "Step 10", "Step 1"],
    optionalSteps: [
      "Step 3",
      "Step 1",
      "Step 9",
      "Step 5",
      "Step 6",
      "Step 8",
      "Step 2",
      "Step 4",
      "Step 10",
      "Step 7",
    ],
  },
  {
    code: { jv: task1JV.default, py: task1PY.default },
    solutionSteps: [
      "Download a ZIP file from the internet",
      "Extract one file from a ZIP file",
      "Interpret a file as CSV with the delimiter ';'",
      "Translate column names to English",
      "Select some colums from the data",
      "Save the data to a SQLite database",
    ],
    optionalSteps: [
      "Save the data to a PostgreSQL database",
      "Download a ZIP file from the internet",
      "Interpret a file as CSV with the delimiter ';'",
      "Delete the last ten rows of data",
      "Translate column names to English",
      "Extract one file from a ZIP file",
      "Save the data to a SQLite database",
      "Download a TXT file from the internet",
      "Add a new column based on existing data",
      "Select some colums from the data",
      "Calculate the average of a column",
      "Transform all temperatures to Fahrenheit",
    ],
  },
  {
    code: { jv: task2JV.default, py: task2PY.default },
    solutionSteps: [
      "Download a file from the internet",
      "Interpret a file as CSV with the delimiter ','",
      "Validate that latitude and longitude are valid geographic coordinates",
      "Add a new column based on existing data",
      "Save the data to a SQLite database",
    ],
    optionalSteps: [
      "Translate column names to English",
      "Download a file from the internet",
      "Save the data to a PostgreSQL database",
      "Add a new column based on existing data",
      "Calculate the average of a column",
      "Validate that latitude and longitude are valid geographic coordinates",
      "Save the data to a SQLite database",
      "Download a ZIP file from the internet",
      "Transform all temperatures to Fahrenheit",
      "Delete the last ten rows of data",
      "Interpret a file as CSV with the delimiter ','",
    ],
  },
];

export const getTaskConfigs = (): TaskConfig[] => taskConfigs;

export const getLanguageSequenceForGroup = (group: Group): Language[] => {
  switch (group) {
    case "AB":
      return ["jv", "jv", "py"];
    case "BA":
      return ["jv", "py", "jv"];
  }
};
