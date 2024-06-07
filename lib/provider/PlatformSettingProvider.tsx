import { createContext, useState } from "react";

type PlatformSettingContextProps = {
    platformSetting: any | null | undefined;
    setPlatformSetting: React.Dispatch<
        React.SetStateAction<any | null | undefined>
    >;
};

const PlatformSettingContext = createContext<PlatformSettingContextProps>(
    {} as PlatformSettingContextProps
);

interface Props {
    children: any;
    initialPlatformSetting: any; 
}

const PlatformSettingProvider: React.FC<Props> = ({ children, initialPlatformSetting }) => { 
    const [platformSetting, setPlatformSetting] = useState<
        any | null | undefined
    >(initialPlatformSetting); 

    const value: PlatformSettingContextProps = {
        platformSetting,
        setPlatformSetting,
    };

    return (
        <PlatformSettingContext.Provider value={value}>
            {children}
        </PlatformSettingContext.Provider>
    );
};

export { PlatformSettingContext, PlatformSettingProvider };
