import 'jasmine';

beforeAll((): void => {
  jasmine.addMatchers({
    toHaveProperty: () => ({
      compare: (
        actual: unknown,
        expected: string
      ): { pass: boolean; message: string } => {
        const pass = Boolean(
          actual && typeof actual === 'object' && expected in actual
        );

        return {
          pass,
          message: `Expected ${JSON.stringify(
            actual
          )} to have property '${expected}'`,
        };
      },
    }),
  });
});

