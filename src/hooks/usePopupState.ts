import React from "react";

interface PopupState {
  open: boolean;
  close: () => void;
  toggle: (event: React.MouseEvent<HTMLElement>) => void;
  bindTrigger: {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
  };
  bindPopup: {
    open: boolean;
    anchorEl: Element;
    onClose: () => void;
  };
}

/**
 * Custom hook to manage popup state similar to material-ui-popup-state.
 * @returns {PopupState} - An object containing state and bindings for triggers and popups.
 */
export function usePopupState(): PopupState {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const close = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const toggle = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  return {
    open: Boolean(anchorEl),
    close,
    toggle,
    bindTrigger: {
      onClick: toggle,
    },
    bindPopup: {
      open: Boolean(anchorEl),
      anchorEl: anchorEl,
      onClose: close,
    },
  };
}
