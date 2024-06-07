import "../styles/globals.css";
import { AppProps } from 'next/app';
import { PlatformSettingProvider } from "../lib/provider/PlatformSettingProvider";
import { AuthProvider } from "../lib/provider/AuthProvider";
import { library } from "@fortawesome/fontawesome-svg-core";
import font from "../lib/font";
import {
    faShirt,
    faComputer,
    faUtensils,
    faToiletPaper,
    faRobot,
    faGlobe
} from "@fortawesome/free-solid-svg-icons";

function MyApp({ Component, pageProps }: AppProps) {
    const { defaultFont } = font();
    library.add(
        faShirt,
        faComputer,
        faUtensils,
        faToiletPaper,
        faRobot,
        faGlobe
    );

    return (
        <div className={defaultFont.className}>
            <AuthProvider>
                <PlatformSettingProvider initialPlatformSetting={pageProps.platformSettings}>
                    <Component {...pageProps} />
                </PlatformSettingProvider>
            </AuthProvider>
        </div>
    );
}

export default MyApp;
