export const logError = (context: string, error: unknown): void => {
    const errorType = error instanceof Error
        ? error.name
        : typeof error;

    console.error("[API ERROR]", {
        context,
        errorType,
    });
};
