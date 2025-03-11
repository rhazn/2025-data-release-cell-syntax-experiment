import * as syntaxData1 from "../tasks/syntax-data1.csv?raw";
import * as syntaxData2 from "../tasks/syntax-data2.csv?raw";

const tableData1 = syntaxData1.default
  .split("\n")
  .map((row) => row.replaceAll('"', "").split(","));
const tableData2 = syntaxData2.default
  .split("\n")
  .map((row) => row.replaceAll('"', "").split(","));

const codeJV = {
  surroundingCode: {
    codeBefore: `// Jayvee code
// Other blocks and pipeline definition... 

block DataSelector oftype CellRangeSelector {`,
    codeAfter: `}`,
    lineBefore: `  select: range `,
    lineAfter: `;`,
  },
};

const codePY = {
  surroundingCode: {
    codeBefore: `// Python code
// Imports and pipeline definition...
        
df = pd.read_csv('./data.csv')`,
    codeAfter: ``,
    lineBefore: `df.iloc[`,
    lineAfter: `]`,
  },
};

const codeExample = {
  surroundingCode: {
    codeBefore: `// This is an example task
// This task is not measured

// Please familiarize yourself with the environment
// The upcoming tasks will ask you to complete code to select cells

`,
    codeAfter: ``,
    lineBefore: `complete with any pseudocode: [`,
    lineAfter: `]`,
  },
};

const getReadCodeJV = (range: string): string => {
  return `
// Jayvee code
// Other blocks and pipeline definition...

block DataSelector oftype CellRangeSelector {
  select: range ${range};
};`;
};

const getReadCodePY = (range: string): string => {
  return `
// Python code
// Imports and pipeline definition...

df = pd.read_csv('./data.csv')

df.iloc[${range}]
`;
};

const getReadCodeExample = (): string => {
  return `
// This is an example task
// This task is not measured

// Please familiarize yourself with the environment
// The upcoming tasks will ask you to select cells with your mouse
// depending on the code you are shown

// Please select some cells and submit
`;
};

export type Language = "jv" | "py";
export type Group = "AB" | "BA";
export type TaskType = "SYNTAX_READ" | "SYNTAX_WRITE";

export interface TaskConfig {
  type: TaskType;
  data: TaskConfigSyntaxWrite | TaskConfigSyntaxRead;
}

export interface TaskConfigSyntaxWrite {
  jv: {
    surroundingCode: {
      codeBefore: string;
      codeAfter: string;
      lineBefore: string;
      lineAfter: string;
    };
  };
  py: {
    surroundingCode: {
      codeBefore: string;
      codeAfter: string;
      lineBefore: string;
      lineAfter: string;
    };
  };
  tableData: (string | number)[][];
  highlightStart: number[];
  highlightEnd: number[];
}

export interface TaskConfigSyntaxRead {
  jv: {
    code: string;
  };
  py: {
    code: string;
  };
  tableData: (string | number)[][];
}

const taskConfigs: TaskConfig[] = [
  {
    type: "SYNTAX_WRITE",
    data: {
      jv: codeExample,
      py: codeExample,
      tableData: tableData1,
      highlightStart: [3, 3],
      highlightEnd: [5, 5],
    },
  },
  {
    type: "SYNTAX_WRITE",
    data: {
      jv: codeJV,
      py: codePY,
      tableData: tableData1,
      highlightStart: [1, 0],
      highlightEnd: [3, 10],
    },
  },
  {
    type: "SYNTAX_WRITE",
    data: {
      jv: codeJV,
      py: codePY,
      tableData: tableData1,
      highlightStart: [0, 0],
      highlightEnd: [4, 3],
    },
  },
  {
    type: "SYNTAX_WRITE",
    data: {
      jv: codeJV,
      py: codePY,
      tableData: tableData1,
      highlightStart: [0, 4],
      highlightEnd: [9, 7],
    },
  },
  {
    type: "SYNTAX_WRITE",
    data: {
      jv: codeJV,
      py: codePY,
      tableData: tableData1,
      highlightStart: [3, 3],
      highlightEnd: [8, 7],
    },
  },
  {
    type: "SYNTAX_READ",
    data: {
      jv: { code: getReadCodeExample() },
      py: { code: getReadCodeExample() },
      tableData: tableData2,
    },
  },
  {
    type: "SYNTAX_READ",
    data: {
      jv: { code: getReadCodeJV("A4:*5") },
      py: { code: getReadCodePY("3:5, :") },
      tableData: tableData2,
    },
  },
  {
    type: "SYNTAX_READ",
    data: {
      jv: { code: getReadCodeJV("A7:C10") },
      py: { code: getReadCodePY("6:10, 0:3") },
      tableData: tableData2,
    },
  },
  {
    type: "SYNTAX_READ",
    data: {
      jv: { code: getReadCodeJV("C1:E*") },
      py: { code: getReadCodePY(":, 2:5") },
      tableData: tableData2,
    },
  },
  {
    type: "SYNTAX_READ",
    data: {
      jv: { code: getReadCodeJV("E5:I8") },
      py: { code: getReadCodePY("4:8, 4:9") },
      tableData: tableData2,
    },
  },
];

export const getTaskConfigs = (): TaskConfig[] => taskConfigs;

export const getLanguageSequenceForGroup = (group: Group): Language[] => {
  switch (group) {
    case "AB":
      return [
        "jv" /* example task */,
        "jv",
        "py",
        "jv",
        "py",
        "jv" /* example task */,
        "jv",
        "py",
        "jv",
        "py",
      ];
    case "BA":
      return [
        "jv" /* example task */,
        "py",
        "jv",
        "py",
        "jv",
        "jv" /* example task */,
        "py",
        "jv",
        "py",
        "jv",
      ];
  }
};
