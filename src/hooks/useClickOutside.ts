import { useEffect, RefObject, useRef, useCallback } from "react";

type Handler = (event: Event) => void;

type EventType = "mousedown" | "touchstart";

type AddEventListeners = (
  events: EventType[],
  handler: EventListenerOrEventListenerObject
) => () => void;

type RemoveEventListeners = (
  events: EventType[],
  handler: EventListenerOrEventListenerObject
) => void;

const defaultEvents: EventType[] = ["mousedown", "touchstart"];

const removeEventListeners: RemoveEventListeners = (events, handler) => {
  events.forEach((event) => {
    document.removeEventListener(event, handler);
  });
};

const addEventListeners: AddEventListeners = (events, handler) => {
  events.forEach((event) => {
    document.addEventListener(event, handler);
  });

  return (): void => removeEventListeners(events, handler);
};

export const useClickOutside = <T extends HTMLElement>(
  handler: Handler,
  events: EventType[] = defaultEvents
): RefObject<T> => {
  const ref = useRef<T>(null);

  const detectClickOutside = useCallback<EventListener>(
    (event) => {
      !ref.current ||
        (!ref.current.contains(event.target as Node) && handler(event));
    },
    [handler]
  );

  useEffect(
    () => addEventListeners(events, detectClickOutside),
    [handler, events, detectClickOutside]
  );

  return ref;
};
