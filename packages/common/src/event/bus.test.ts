import { EventBus, type EventBusListenerArgs } from "./bus";

interface TestEventData {
  message: string;
}

describe("base event bus implementation tests", () => {
  it("should manage subscriptions correctly", () => {
    const bus = new EventBus<{
      channel1: TestEventData;
      channel2: TestEventData;
    }>();
    const channel1Listener = vi.fn();
    const channel2Listener = vi.fn();
    const channel1Listener2 = vi.fn();
    bus.subscribe("channel1", channel1Listener);
    expect(bus.listeners.get("channel1")?.has(channel1Listener));

    bus.subscribe("channel2", channel2Listener);
    expect(bus.listeners.get("channel2")?.has(channel2Listener));

    bus.subscribe("channel1", channel1Listener2);
    expect(bus.listeners.get("channel1")?.has(channel1Listener2));

    bus.unsubscribe("channel1", channel1Listener);
    expect(bus.listeners.get("channel1")?.has(channel1Listener)).toBe(false);

    bus.unsubscribe("channel2", channel2Listener);
    expect(bus.listeners.get("channel2")?.has(channel2Listener)).toBe(false);

    bus.unsubscribe("channel1", channel1Listener2);
    expect(bus.listeners.get("channel1")?.has(channel1Listener2)).toBe(false);
  });

  it("should call correct listeners", () => {
    const bus = new EventBus<{
      channel1: TestEventData;
      channel2: TestEventData;
    }>();
    const message1 = { message: "Hello Channel 1" };
    const message2 = { message: "Hello Channel 2" };

    const channel1handler1 = vi.fn(
      (args: EventBusListenerArgs<TestEventData>) => {
        expect(args.data).toEqual(message1);
      },
    );
    const channel1handler2 = vi.fn(
      (args: EventBusListenerArgs<TestEventData>) => {
        expect(args.data).toEqual(message1);
      },
    );
    const channel2handler = vi.fn(
      (args: EventBusListenerArgs<TestEventData>) => {
        expect(args.data).toEqual(message2);
      },
    );

    bus.subscribe("channel1", channel1handler1);
    bus.subscribe("channel1", channel1handler2);
    bus.subscribe("channel2", channel2handler);

    bus.emit("channel1", message1);
    expect(channel1handler1).toHaveBeenCalled();
    expect(channel1handler2).toHaveBeenCalled();
    expect(channel2handler).not.toHaveBeenCalled();

    bus.emit("channel2", message2);
    expect(channel2handler).toHaveBeenCalled();
  });

  it("should subscribe many handlers", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const bus = new EventBus<{
      channel1: TestEventData;
    }>();
    const unsubscribe = bus.subscribeMany("channel1", handler1, handler2);
    expect(bus.listeners.get("channel1")?.has(handler1)).toBe(true);
    expect(bus.listeners.get("channel1")?.has(handler2)).toBe(true);
    unsubscribe();
    expect(bus.listeners.get("channel1")?.has(handler1)).toBe(false);
    expect(bus.listeners.get("channel1")?.has(handler2)).toBe(false);
  });

  it("should remove all listeners of a channel", () => {
    const bus = new EventBus<{
      channel1: TestEventData;
    }>();
    bus.subscribeMany(
      "channel1",
      () => {},
      () => {},
      () => {},
    );
    const listenerSet = bus.listeners.get("channel1");
    expect(listenerSet?.size).toBe(3);
    bus.removeAllListeners("channel1");
    expect(bus.listeners.get("channel1")).toBeUndefined();
  });
});
