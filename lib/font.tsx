import { NextFont } from "next/dist/compiled/@next/font";
import { RocknRoll_One } from "next/font/google";

const defaultFont = RocknRoll_One({
    weight: ["400"],
    subsets: ["latin"],
    display: "swap",
});

export default function font(): {
    defaultFont: NextFont;
} {

    return {
        defaultFont
    };
}