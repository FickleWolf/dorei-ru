import { NextFont } from "next/dist/compiled/@next/font";
import { RocknRoll_One } from "next/font/google";

const rocknRoll_One = RocknRoll_One({
    weight: ["400"],
    subsets: ["latin"],
    display: "swap",
});

export default function font(): {
    rocknRoll_One: NextFont;
} {

    return {
        rocknRoll_One
    };
}