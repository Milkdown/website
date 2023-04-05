import { Inspection } from "@milkdown/ctx";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const inspectorCtx = createContext<Inspection[]>([]);
export const setInspectorCtx = createContext<
  Dispatch<SetStateAction<Inspection[]>>
>(() => {});

export const useInspector = () => useContext(inspectorCtx);
export const useSetInspector = () => useContext(setInspectorCtx);

export const InspectorProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [inspector, setInspector] = useState<Inspection[]>([]);

  return (
    <inspectorCtx.Provider value={inspector}>
      <setInspectorCtx.Provider value={setInspector}>
        {children}
      </setInspectorCtx.Provider>
    </inspectorCtx.Provider>
  );
};
