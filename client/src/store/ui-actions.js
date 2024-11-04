import { displayNotification } from "../components/Notification";
import { uiActions } from "./ui-slice";
import { toast } from "react-toastify";

export const showNotification = (notificationData) => {
  return (dispatch) => {
    if (notificationData.status === "success") {
      toast.success(notificationData.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (notificationData.status === "error") {
      toast.error(notificationData.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    // displayNotification(notificationData);

    dispatch(uiActions.resetNotification());
  };
};
