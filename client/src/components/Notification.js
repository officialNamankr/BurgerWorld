import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const displayNotification = (notificationData) => {
  console.log("Notification Received");

  console.log(notificationData);

  if (notificationData.notificationStatus === "success") {
    successNotification(notificationData.notificationMessage);
  } else if (notificationData.notificationStatus === "error") {
    errorNotification(notificationData.notificationMessage);
  }
};

const successNotification = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

const errorNotification = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export { displayNotification };
