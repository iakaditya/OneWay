type JourneyEvent = {
  type: string;
  journeyId: string;
  at: string;
};

type Listener = (event: JourneyEvent) => void;

const globalEvents = globalThis as typeof globalThis & {
  __onewayJourneyListeners?: Map<string, Set<Listener>>;
};

const listeners = globalEvents.__onewayJourneyListeners ?? new Map<string, Set<Listener>>();
globalEvents.__onewayJourneyListeners = listeners;

export function publishJourneyEvent(journeyId: string, type: string) {
  const event = { type, journeyId, at: new Date().toISOString() };
  listeners.get(journeyId)?.forEach((listener) => listener(event));
}

export function subscribeToJourney(journeyId: string, listener: Listener) {
  const journeyListeners = listeners.get(journeyId) ?? new Set<Listener>();
  journeyListeners.add(listener);
  listeners.set(journeyId, journeyListeners);
  return () => {
    journeyListeners.delete(listener);
    if (journeyListeners.size === 0) listeners.delete(journeyId);
  };
}

