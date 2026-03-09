import { useRef } from "react";
import { EventSend } from "ezhooks";
import { useAlert } from "@contexts/AlertContext";

type Props = {
  title: string;
  service: (event: EventSend) => Promise<void>;
  onSuccess?: () => void;
};

const useDelete = (props: Props) => {
  const alert = useAlert();
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleDelete = (id: number, message?: string) => {
    alert.set({
      open: true,
      title: props.title || "Confirm Deletion",
      message: message || "Are you sure you want to delete this item?",
      type: "warning",
      close: {
        text: "Cancel",
      },
      confirm: {
        text: "Delete",
        onClick: () => {
          alert.set({ loading: true });
          abortControllerRef.current = new AbortController();
          props
            .service({ params: { id }, ctr: abortControllerRef.current })
            .then(() => {
              props.onSuccess?.();
            })
            .finally(() => {
              alert.reset();
              abortControllerRef.current = null;
            });
        },
      },
    });
  };

  const cancel = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  };

  return { handleDelete, cancel };
};

export default useDelete;
