import pandas as pd
import json
import subprocess
import os
import sqlite3
import re


def dfFromJVCode(filePath: str, selectCode: str, expectedColumns: int) -> pd.DataFrame:
    testJVCode(filePath, f"{filePath}.out.sqlite", selectCode, expectedColumns)

    with sqlite3.connect(f"{filePath}.out.sqlite") as conn:
        query = "SELECT * FROM data"
        df = pd.read_sql_query(query, conn)

    if os.path.isfile(f"{filePath}.out.sqlite"):
        os.remove(f"{filePath}.out.sqlite")

    return df


def testJVCode(
    filePath: str, outputFile: str, selectCode: str, expectedColumns: int
) -> None:
    with open("./pipeline.jv", "r") as file:
        code = file.read()
        code = code.replace("{filePath}", f'"{filePath}"')
        code = code.replace("{outputFilePath}", f'"{outputFile}"')
        code = code.replace("{selectSyntax}", selectCode)
        code = code.replace(
            "{columns}",
            ", ".join([f'"{num}" oftype text' for num in range(expectedColumns)]),
        )

    with open("run.jv", "w") as file:
        file.write(code)

    subprocess.run(["jv", "run.jv"], capture_output=True, text=True)

    if os.path.isfile("run.jv"):
        os.remove("run.jv")


def getExperimentSequence(id: str, df: pd.DataFrame) -> str | None:
    context = df[(df["experiment"] == id) & (df["type"] == "EXPERIMENTSTART")][
        "context"
    ]

    if len(context.index) == 0:
        return None

    context = json.loads(context.iloc[0])

    return context.get("group", None)


def getTaskDurationSeconds(
    experimentId: str, taskId: int, df: pd.DataFrame
) -> float | None:
    start = df[
        (df["experiment"] == experimentId)
        & (df["task"] == taskId)
        & (df["type"] == "TASKSTART")
    ]
    finish = df[
        (df["experiment"] == experimentId)
        & (df["task"] == taskId)
        & (df["type"] == "TASKCOMPLETED")
    ]

    if len(start.index) == 0 or len(finish.index) == 0:
        return None

    return (float(finish.iloc[0]["time"]) - float(start.iloc[0]["time"])) / 1000


def getTaskCorrectness(experimentId: str, taskId: int, df: pd.DataFrame) -> float:
    # task 0-4 are syntax write tasks
    if taskId <= 4:
        return getTaskCorrectnessSyntaxWrite(experimentId, taskId, df)
    # task 5-9 are syntax read tasks
    return getTaskCorrectnessSyntaxRead(experimentId, taskId, df)


# Based on Jaccard index: https://en.wikipedia.org/wiki/Jaccard_index
def getTaskCorrectnessSyntaxRead(
    experimentId: str, taskId: int, df: pd.DataFrame
) -> float:
    correctSolutions = {
        5: "[]",
        6: "[[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9]]",
        7: "[[6,0],[6,1],[6,2],[7,2],[8,2],[9,2],[9,1],[9,0],[8,0],[7,0],[7,1],[8,1]]",
        8: "[[0,2],[9,4],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]]",
        9: "[[4,4],[7,8],[4,5],[4,6],[4,7],[4,8],[5,4],[5,5],[5,6],[5,7],[5,8],[6,4],[6,5],[6,6],[6,7],[6,8],[7,4],[7,5],[7,6],[7,7]]",
    }

    context = getTaskSolution(experimentId=experimentId, taskId=taskId, df=df)

    solutionSet = {tuple(cell) for cell in correctSolutions[taskId]}
    submissionSet = {tuple(cell) for cell in context}

    intersection = solutionSet.intersection(submissionSet)
    union = solutionSet.union(submissionSet)

    return len(intersection) / len(union) if union else 0.0


def getTaskCorrectnessSyntaxWrite(
    experimentId: str, taskId: int, df: pd.DataFrame
) -> float:
    languageMapping = {
        "AB": {
            0: "jv",  # initial task uses pseudo code and is not part of the experiment, so we can assume any language
            1: "jv",
            2: "py",
            3: "jv",
            4: "py",
        },
        "BA": {
            0: "jv",  # initial task uses pseudo code and is not part of the experiment, so we can assume any language
            1: "py",
            2: "jv",
            3: "py",
            4: "jv",
        },
    }
    sequence = getExperimentSequence(experimentId, df)
    language = languageMapping[sequence][taskId]
    context = getTaskSolution(experimentId=experimentId, taskId=taskId, df=df)

    return (
        getTaskCorrectnessSyntaxWritePY(taskId, context)
        if language == "py"
        else getTaskCorrectnessSyntaxWriteJV(taskId, context)
    )


def getTaskCorrectnessSyntaxWritePY(taskId: int, solution: str) -> float:
    # Fix small scale syntax errors to avoid giving 0 correctness for trivial mistakes
    # that can come from not understanding the input mask correctly.
    # This is done equally for PY and JV, both remove whitespaces, both remove syntax that
    # was in the line the students needed to complete already.

    # Remove leading/trailing whitespace
    solution = solution.strip()

    # Remove df.iloc repeat that was in the experiment mask but some students repeated it
    ilocPattern = r"df\d+\.iloc\[(.*?)\]"
    solution = re.sub(ilocPattern, r"\1", solution)

    df = pd.read_csv("./experiment/tasks/syntax-data1.csv", header=None)

    # Replace each value with the string of (row index, column index)
    # We do this so we can find the intersection/union of the two dataframes
    # after selecting a subset of the data

    # Function to replace each value with (row index, column index)
    def replace_with_indices(df):
        df = df.astype(str)
        for row_index, row in df.iterrows():
            for col_index, value in row.items():
                # Replace value with a string of (row index, column index)
                df.at[row_index, col_index] = f"({row_index}, {col_index})"
        return df

    df = replace_with_indices(df)

    correctSolutions = {
        0: df.iloc[:, :],
        1: df.iloc[1:4, :],
        2: df.iloc[0:5, 0:4],
        3: df.iloc[:, 4:8],
        4: df.iloc[3:9, 3:8],
    }

    correctSolution = correctSolutions[taskId]
    try:
        submission = eval(f"df.iloc[{solution}]")
    except:
        # Not valid python code -> 0 correctness
        return 0

    if not isinstance(submission, pd.DataFrame):
        # Code does not create a dataframe -> 0 correctness
        return 0

    solutionValues = set(correctSolution.values.flatten())
    submissionValues = set(submission.values.flatten())

    intersection = solutionValues.intersection(submissionValues)
    union = solutionValues.union(submissionValues)

    return len(intersection) / len(union) if union else 0.0


def getTaskCorrectnessSyntaxWriteJV(taskId: int, solution: str) -> float:
    # Fix small scale syntax errors to avoid giving 0 correctness for trivial mistakes
    # that can come from not understanding the input mask correctly.
    # This is done equally for PY and JV, both remove whitespaces, both remove syntax that
    # was in the line the students needed to complete already.

    # Remove leading/trailing whitespace
    solution = solution.strip()

    # Remove trailing ; if it exists, this was shown in the experiment mask but some students missed it
    solution = solution.rstrip(";")

    # Remove select: range repeat that was in the experiment mask but some students repeated it
    selectRangePattern = r"select\: range (.*?)"
    solution = re.sub(selectRangePattern, r"\1", solution)

    jvVersion = subprocess.run(["jv", "-V"], capture_output=True, text=True)

    if jvVersion.stdout != "0.5.0\n":
        raise Exception("Jayvee version is not 0.5.0")

    expectedColumns = {
        0: 1,
        1: 10,
        2: 4,
        3: 4,
        4: 5,
    }

    df = pd.read_csv("./experiment/tasks/syntax-data1.csv", header=None)

    # Replace each value with the string of (row index, column index)
    # We do this so we can find the intersection/union of the two dataframes
    # after selecting a subset of the data

    # Function to replace each value with (row index, column index)
    def replace_with_indices(df):
        df = df.astype(str)
        for row_index, row in df.iterrows():
            for col_index, value in row.items():
                # Replace value with a string of (row index, column index)
                df.at[row_index, col_index] = f"({row_index}, {col_index})"
        return df

    df = replace_with_indices(df)

    correctSolutions = {
        0: df.iloc[:, :],
        1: df.iloc[1:4, :],
        2: df.iloc[0:5, 0:4],
        3: df.iloc[:, 4:8],
        4: df.iloc[3:9, 3:8],
    }

    correctSolution = correctSolutions[taskId]

    try:
        df.to_csv("./dfWithIndices.csv", index=False, header=False)

        submission = dfFromJVCode(
            "./dfWithIndices.csv", solution, expectedColumns[taskId]
        )

        if os.path.isfile("./dfWithIndices.csv"):
            os.remove("./dfWithIndices.csv")
    except:
        # Not valid code -> 0 correctness
        return 0

    if not isinstance(submission, pd.DataFrame):
        # Code does not create a dataframe -> 0 correctness
        return 0

    solutionValues = set(correctSolution.values.flatten())
    submissionValues = set(submission.values.flatten())

    intersection = solutionValues.intersection(submissionValues)
    union = solutionValues.union(submissionValues)

    return len(intersection) / len(union) if union else 0.0


def getTaskSolution(experimentId: str, taskId: int, df: pd.DataFrame) -> str:
    finish = df[
        (df["experiment"] == experimentId)
        & (df["task"] == taskId)
        & (df["type"] == "TASKCOMPLETED")
    ]

    if len(finish.index) == 0:
        return ""

    return str(json.loads(finish.iloc[0]["context"])["solution"])


def getTaskFromLocation(location: str) -> int | None:
    pathname = json.loads(location)["pathname"]

    if "/s/" in pathname:
        return int(pathname.split("/s/")[1])

    return None
