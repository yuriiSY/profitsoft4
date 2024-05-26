interface MessageList {
  [key: number]: string;
}

const messageList: MessageList = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

const HttpError = (status: number, message?: string): Error => {
  const errorMessage = message || messageList[status];
  const error = new Error(errorMessage);
  (error as any).status = status;
  return error;
};

export default HttpError;
