import "../styles/globals.css";
import type { AppProps } from "next/app";
import { PlatformSettingProvider } from "../lib/PlatformSetting";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faShirt,
    faComputer,
    faUtensils,
    faToiletPaper,
    faRobot,
    faGlobe
} from "@fortawesome/free-solid-svg-icons";

function MyApp({ Component, pageProps }: AppProps) {
    library.add(
        faShirt,
        faComputer,
        faUtensils,
        faToiletPaper,
        faRobot,
        faGlobe
    );

    return (
        <>
            <PlatformSettingProvider>
                <Component {...pageProps} />
            </PlatformSettingProvider>
        </>
    );
}

export default MyApp;

