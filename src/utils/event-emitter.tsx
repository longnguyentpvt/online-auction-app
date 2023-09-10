import {
  EventCallback,
  EventName
} from "types/event-emitter";

const events: Record<EventName, EventCallback[]> = { [EventName.UserSessionChange]: [] };

const emitCallback = async (callbackFn: EventCallback, data: unknown): Promise<void> => {
  !!callbackFn && callbackFn(data);
};

export const EventEmitter = {
  emit: function (
    event: string,
    data?: unknown
  ): void {
    const emitEvents = events[event];
    !!emitEvents && emitEvents.forEach((callback: EventCallback) => emitCallback(callback, data));
  },
  subscribe: function (
    event: EventName,
    callback: EventCallback
  ): void {
    if (callback) {
      let emitEvents = events[event];
      if (!emitEvents) {
        emitEvents = [];
        events[event] = emitEvents;
      }

      emitEvents.push(callback);
    }
  },
  unsubscribe: function (
    event: EventName,
    unsubscribeCallback: EventCallback
  ): void {
    const emitEvents = events[event];

    if (emitEvents) {
      for (let i = emitEvents.length; i >= 0; i--) {
        if (emitEvents[i] === unsubscribeCallback) {
          emitEvents.splice(i, 1);
        }
      }
    }
  }
};
