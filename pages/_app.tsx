import "../styles/globals.css";
import type { AppProps } from "next/app";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faShirt,
    faCouch,
    faGamepad,
    faRobot,
    faSprayCanSparkles,
    faComputer,
    faBaseballBatBall,
    faCarSide,
    faPaw,
    faUtensils,
    faBottleDroplet,
    faToiletPaper,
    faStopwatch,
    faPenRuler,
    faGlobe,
} from "@fortawesome/free-solid-svg-icons";

function MyApp({ Component, pageProps }: AppProps) {
    library.add(
        faShirt,
        faCouch,
        faGamepad,
        faRobot,
        faSprayCanSparkles,
        faComputer,
        faBaseballBatBall,
        faCarSide,
        faPaw,
        faUtensils,
        faBottleDroplet,
        faToiletPaper,
        faStopwatch,
        faPenRuler,
        faGlobe
    );

    return (
        <Component {...pageProps} />
    );
}

export default MyApp;

