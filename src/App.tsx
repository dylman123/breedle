import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Game } from "./components/Game";
import React, { useEffect, useState } from "react";
import { Infos } from "./components/panels/Infos";
import { useTranslation } from "react-i18next";
// import { InfosCo } from "./components/panels/InfosCo";
// import { InfosFr } from "./components/panels/InfosFr";
// import { InfosHu } from "./components/panels/InfosHu";
// import { InfosNl } from "./components/panels/InfosNl";
// import { InfosPl } from "./components/panels/InfosPl";
// import { InfosDe } from "./components/panels/InfosDe";
// import { InfosJa } from "./components/panels/InfosJa";
import { Settings } from "./components/panels/Settings";
import { useSettings } from "./hooks/useSettings";
import { Breedle } from "./components/Breedle";
import { Stats } from "./components/panels/Stats";
import { Twemoji } from "@teuteuf/react-emoji-render";
// import { getDayString, useTodays } from "./hooks/useTodays";

export default function App() {
  const { t, i18n } = useTranslation();

  // const dayString = useMemo(getDayString, []);

  const [infoOpen, setInfoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const [settingsData, updateSettings] = useSettings();

  // const [{ breed }] = useTodays(dayString, settingsData);

  useEffect(() => {
    if (settingsData.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settingsData.theme]);

  let InfosComponent;
  switch (i18n.resolvedLanguage) {
    // case "co":
    //   InfosComponent = InfosCo;
    //   break;
    // case "fr":
    //   InfosComponent = InfosFr;
    //   break;
    // case "hu":
    //   InfosComponent = InfosHu;
    //   break;
    // case "nl":
    //   InfosComponent = InfosNl;
    //   break;
    // case "pl":
    //   InfosComponent = InfosPl;
    //   break;
    // case "de":
    //   InfosComponent = InfosDe;
    //   break;
    // case "ja":
    //   InfosComponent = InfosJa;
    //   break;
    default:
      InfosComponent = Infos;
  }

  return (
    <>
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        theme={settingsData.theme}
        autoClose={2000}
        bodyClassName="font-bold text-center"
        toastClassName="flex justify-center m-2 max-w-full"
        style={{ width: 500, maxWidth: "100%" }}
      />
      <InfosComponent
        isOpen={infoOpen}
        close={() => setInfoOpen(false)}
        settingsData={settingsData}
      />
      <Settings
        isOpen={settingsOpen}
        close={() => setSettingsOpen(false)}
        settingsData={settingsData}
        updateSettings={updateSettings}
      />
      <Stats isOpen={statsOpen} close={() => setStatsOpen(false)} />
      <div className="flex justify-center flex-auto dark:bg-gradient-to-l from-indigo-900 to-blue-700 dark:text-slate-50 overflow-hidden">
        <div className="w-full max-w-lg flex flex-col">
          <header className="border-b-2 px-3 border-gray-200 flex">
            <button
              className="mr-3 text-xl"
              type="button"
              onClick={() => setInfoOpen(true)}
            >
              <Twemoji text="❓" />
            </button>
            <div className="tracking-wide text-center my-1 flex-auto flex justify-center flex-col">
              <h1 className="text-3xl font-bold uppercase">
                <Breedle />
              </h1>
              <p className="text-sm">
                Created by{" "}
                <a
                  href="https://www.heydoggydoor.com.au/breeder"
                  className="underline underline-offset-1"
                >
                  DoggyDoor
                </a>
              </p>
            </div>
            <button
              className="ml-3 text-xl"
              type="button"
              onClick={() => setStatsOpen(true)}
            >
              <Twemoji text="📈" />
            </button>
            <button
              className="ml-3 text-xl"
              type="button"
              onClick={() => setSettingsOpen(true)}
            >
              <Twemoji text="⚙️" />
            </button>
          </header>
          <Game settingsData={settingsData} updateSettings={updateSettings} />
          <footer className="flex justify-center items-center mt-8 mb-4">
            <Twemoji
              text="❤️"
              className="flex items-center justify-center mr-1"
            />{" "}
            <Breedle />? -
            <a
              className="underline pl-1"
              href="https://ko-fi.com/dylman123"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-max">
                <Twemoji
                  text={t("buyMeACoffee")}
                  options={{ className: "inline-block" }}
                />
              </div>
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}
