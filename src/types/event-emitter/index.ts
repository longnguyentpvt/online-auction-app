type EventCallback = (data?: unknown) => void;

enum EventName {
  UserSessionChange = "UserSessionChange",
  LocaleChange = "LocaleChange"
}

export {
  EventCallback,
  EventName
};
