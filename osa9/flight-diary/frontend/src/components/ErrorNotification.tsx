interface ErrorNotificationProps {
  message?: string;
}

const ErrorNotification = ({ message }: ErrorNotificationProps) => {
  if (!message) {
    return null;
  }

  return <p style={{ color: "red" }}>{message}</p>;
};

export default ErrorNotification;
