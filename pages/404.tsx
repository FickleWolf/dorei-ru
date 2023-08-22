import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "./components/loading";

const CustomErrorPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push({
            pathname: "/",
        });
    }, []);

    return <Loading />;
};

export default CustomErrorPage;
