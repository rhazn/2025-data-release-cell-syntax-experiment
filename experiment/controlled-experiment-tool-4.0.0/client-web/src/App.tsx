import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ConsentPage } from "./pages/ConsentPage";
import { EndPage } from "./pages/EndPage";
import React, { useEffect, useState } from "react";
import { saveTimedEvent, EventType } from "./events";
import { PreparationPage } from "./pages/PreparationPage";
import {
  Group,
  Language,
  TaskConfig,
  getLanguageSequenceForGroup,
  getTaskConfigs,
} from "./tasks/configSyntax";
import { ExperimentMetadataInputPage } from "./pages/ExperimentMetadataInputPage";
import { SyntaxPreparationPage } from "./pages/SyntaxPreparationPage";
import { SyntaxConsentPage } from "./pages/SyntaxConsentPage";
import { SyntaxEndPage } from "./pages/SyntaxEndPage";
import { TaskPage } from "./pages/TaskPage";

export const ExperimentContext = React.createContext<
  { id: string; group: Group; languageSequence: Language[] } | undefined
>(undefined);

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<TaskConfig[] | undefined>();

  const [experimentId, setExperimentId] = useState<string | undefined>(
    undefined
  );
  const [languageSequence, setLanguageSequence] = useState<
    Language[] | undefined
  >(undefined);
  const [group, setGroup] = useState<Group | undefined>(undefined);

  const onSubmitMetaData = (experimentId: string, group: "AB" | "BA") => {
    window.localStorage.setItem("experimentId", experimentId);
    window.localStorage.setItem("group", group);

    setExperimentId(experimentId);
    setLanguageSequence(getLanguageSequenceForGroup(group));
    setGroup(group);

    saveTimedEvent(experimentId, EventType.EXPERIMENTSTART, location, {
      group,
    });

    navigate("/consentSyntax");
  };

  useEffect(() => {
    const experimentId: string | null =
      window.localStorage.getItem("experimentId");
    const group: string | null = window.localStorage.getItem("group");

    if (experimentId) {
      setExperimentId(experimentId);
    }
    if (group == "AB" || group == "BA") {
      setLanguageSequence(getLanguageSequenceForGroup(group));
      setGroup(group);
    }
  }, []);

  useEffect(() => {
    if (group) {
      setConfigs(getTaskConfigs());
    }
  }, [group]);

  useEffect(() => {
    if (experimentId) {
      saveTimedEvent(experimentId, EventType.PAGEENTER, location, {});
    }
  }, [location]);

  return (
    <>
      {(!experimentId || !group) && (
        <ExperimentMetadataInputPage onSubmitMetaData={onSubmitMetaData} />
      )}
      {experimentId && languageSequence?.length && group && configs?.length && (
        <ExperimentContext.Provider
          value={{
            id: experimentId,
            group: group,
            languageSequence: languageSequence,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <ExperimentMetadataInputPage
                  onSubmitMetaData={onSubmitMetaData}
                />
              }
            />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/consentSyntax" element={<SyntaxConsentPage />} />
            <Route path="/prepare" element={<PreparationPage />} />
            <Route path="/prepareSyntax" element={<SyntaxPreparationPage />} />
            {configs.map((config, i) => (
              <Route
                path={`/s/${i}`}
                key={`/s/${i + 1}`}
                element={
                  <TaskPage
                    config={config}
                    language={languageSequence[i]}
                    nextPage={
                      configs.length === i + 1
                        ? `/endSyntax/${experimentId}`
                        : `/s/${i + 1}`
                    }
                  />
                }
              />
            ))}
            <Route path="/end" element={<EndPage />} />
            <Route path="/endSyntax" element={<SyntaxEndPage />} />
            <Route path="/end/:experimentId" element={<EndPage />} />
            <Route
              path="/endSyntax/:experimentId"
              element={<SyntaxEndPage />}
            />
          </Routes>
        </ExperimentContext.Provider>
      )}
    </>
  );
}

export default App;
