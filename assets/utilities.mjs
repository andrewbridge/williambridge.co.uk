export const AsyncWaiter = () => {
    const promises = [];
    return {
        getAwaiter: () => {
            let resolve;
            const promise = new Promise(r => resolve = r);
            promises.push(promise);
            return resolve;
        },
        awaitAll: () => Promise.all(promises)
    }
}

export const createReactive = (initialValue) => {
    let value = initialValue;
    const listeners = new Set();
    
    return {
        get value() {
            return value;
        },
        set value(newValue) {
            value = newValue;
            listeners.forEach(listener => listener(value));
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        }
    };
}

export const wait = (time) => new Promise(resolve => setTimeout(resolve, time));

export const waitForEvent = (element, event) =>
    new Promise(resolve => element.addEventListener(event, resolve, { once: true }));

export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}