"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
beforeAll(() => {
    jasmine.addMatchers({
        toHaveProperty: () => ({
            compare: (actual, expected) => {
                const pass = Boolean(actual && typeof actual === 'object' && expected in actual);
                return {
                    pass,
                    message: `Expected ${JSON.stringify(actual)} to have property '${expected}'`,
                };
            },
        }),
    });
});
