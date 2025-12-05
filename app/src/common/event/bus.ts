import { nanoid } from "nanoid";

/**
 * Event arguments that will be passed to event bus listeners.
 * @template T type of the data field
 */
export interface EventBusListenerArgs<T> {
  /** An identifier that is randomly generated at broadcast time */
  id: string;
  data: T;
  channel: string;
  /** The unique identifier of the event bus that broadcasted this message. */
  sourceId?: string;
  timestamp: number;
}

/**
 * Generic type definition of an event bus listener.
 * @template T type of event data
 */
export type EventBusListener<T> = (event: EventBusListenerArgs<T>) => void;

/**
 * A message broker interface to connect external sources, like websockets and postmessage, into an `EventBus`
 * @template T type of message data
 */
export interface MessageBroker<T extends EventBusListenerArgs<unknown>> {
  emit: (channel: string, data: T) => void;
}

/**
 * Type map to define event bus channels.
 */
export type EventMap = Record<string, unknown>;

/**
 * A generic, type-safe event bus that performs publish/subscribe on a
 * defined set of typed channels.
 * @template Events the message data type map for channels
 */
export class EventBus<Events extends EventMap> {
  private id: string;
  /**
   * Map of event listeners for each channel.
   */
  public readonly listeners: Map<
    keyof Events,
    Set<EventBusListener<Events[keyof Events]>>
  > = new Map();

  constructor() {
    this.id = nanoid();
  }

  /**
   * Add a listener to a channel defined in `Events`. The same listener cannot be added twice.
   * **Do NOT add anonymous functions from React components, this will cause memory leaks.**
   * @param channel a valid channel key
   * @param fn the listener function
   * @returns a method to unsubscribe the listener
   */
  public subscribe<K extends keyof Events = keyof Events>(
    channel: K,
    fn: EventBusListener<Events[K]>,
  ) {
    if (!this.listeners.has(channel)) this.listeners.set(channel, new Set());
    const listeners = this.listeners.get(channel)! as Set<
      EventBusListener<Events[K]>
    >;
    listeners.add(fn);
    return () => this.unsubscribe(channel, fn);
  }

  /**
   * Remove a known listener from a channel.
   * @param channel a valid channel key
   * @param fn the listener function
   */
  public unsubscribe<K extends keyof Events = keyof Events>(
    channel: K,
    fn: EventBusListener<Events[K]>,
  ) {
    const listeners = this.listeners.get(channel) as Set<
      EventBusListener<Events[K]>
    >;
    if (!listeners) return;
    listeners.delete(fn);
  }

  /**
   * Synchronously and sequentially emit a message to all listeners.
   * @param channel a valid channel name
   * @param data message data
   */
  public emit<K extends keyof Events = keyof Events>(
    channel: K,
    data: Events[K],
  ) {
    const listeners = this.listeners.get(channel) as Set<
      EventBusListener<Events[K]>
    >;
    if (!listeners) return;

    const eventArgs: EventBusListenerArgs<Events[K]> = {
      id: nanoid(),
      data,
      channel: channel as string,
      sourceId: this.id,
      timestamp: Date.now(),
    };

    listeners.forEach((listener) => {
      listener(eventArgs);
    });
  }
}
