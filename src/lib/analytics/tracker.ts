interface AnalyticsEvent {
    type: string;
    timestamp: string;
    data: Record<string, unknown>;
}

class Analytics {
    private events: AnalyticsEvent[] = [];
    private storageKey = 'intelixs-analytics';

    constructor() {
        this.loadEvents();
    }

    private loadEvents() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.events = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    }

    private saveEvents() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.events));
        } catch (error) {
            console.error('Failed to save analytics:', error);
        }
    }

    track(eventType: string, data: Record<string, unknown> = {}) {
        const event: AnalyticsEvent = {
            type: eventType,
            timestamp: new Date().toISOString(),
            data,
        };

        this.events.push(event);
        this.saveEvents();
    }

    getEvents(): AnalyticsEvent[] {
        return [...this.events];
    }

    exportEvents(): string {
        return JSON.stringify(this.events, null, 2);
    }

    clear() {
        this.events = [];
        localStorage.removeItem(this.storageKey);
    }
}

export const analytics = new Analytics();
