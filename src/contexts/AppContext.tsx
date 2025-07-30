import React from "react";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const AppContext = React.createContext({
  isMobile: false,
  trigger: { open: true, key: [] },
  anchorEl: null as null | HTMLElement,
  watch: [] as any[],
  set: (_: null | HTMLElement) => {},
  addKey: (_: string) => {},
  clearKey: () => {},
  setTrigger: (_: Partial<{ open: boolean; key: any[] }>) => {},
  setWatch(_: any) {},
  onClickOpen: () => {},
});

const AppProvider = (props) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between("xs", "md")
  );

  const [trigger, setTrigger] = React.useState({ open: false, key: [] });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [_watch, _setWatch] = React.useState([]);

  const onClickOpen = () => {
    setTrigger((p) => ({ ...p, open: !p.open, key: p.open ? [] : p.key }));
  };

  const set = (val: null | HTMLElement) => {
    setAnchorEl(val);
  };

  const addKey = (key: string) => {
    setTrigger((p) => ({
      ...p,
      key: p.key.includes(key)
        ? p.key.filter((v) => v !== key)
        : [...p.key, key],
    }));
  };

  const clearKey = () => {
    setTrigger((p) => ({
      ...p,
      key: [],
    }));
  };

  const setWatch = (value: any) => {
    _setWatch((p) => {
      const index = p.findIndex(
        (f) =>
          f.path === value.path &&
          f.id === value.id &&
          f.timestamp < value.timestamp
      );
      
      if (index === -1) {
        return [...p, value];
      } else {
        p[index] = value;
        return [...p];
      }
    });
  };

  React.useEffect(() => {
    if (!isMobile && trigger.open) return;
    setTrigger((p) => ({ ...p, open: false, key: [] }));
  }, [isMobile]);

  const memoWatch = React.useMemo(() => _watch, [_watch]);

  return (
    <AppContext.Provider
      value={{
        isMobile,
        trigger,
        anchorEl,
        watch: memoWatch,
        set,
        onClickOpen,
        addKey,
        clearKey,
        setTrigger: (value) => {
          setTrigger((p) => ({ ...p, ...value }));
        },
        setWatch,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  return context;
};

export default AppProvider;
