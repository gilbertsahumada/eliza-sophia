import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action,
} from "@elizaos/core";

export const helloWorldAction: Action = {
    name: "HELLO_WORLD",
    similes: ["HELLO"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: "Make a cool hello world",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        _callback: HandlerCallback
    ): Promise<boolean> => {
        const helloworld = `
         _   _      _ _         __        __         _     _ _
        | | | |    | | |        \\ \\      / /        | |   | | |
        | |_| | ___| | | ___     \\ \\_/\\_/ /__  _   _| |__ | | |
        |  _  |/ _ \\ | |/ _ \\     \\ /\\ / / _ \\| | | | '_ \\| | |
        | | | |  __/ | | (_) |     \\ V  V / (_) | |_| | | | | |
        \\_| |_/\\___|_|_|\\___( )     \\_/\\_/ \\___/ \\__,_|_| |_|_|
                           |/
        `;
        _callback({ text: helloworld });
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Say hello world" },
            },
            {
                user: "{{agentName}}",
                content: { text: "HELLO_WORLD", action: "HELLO_WORLD" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Can you greet the world?" },
            },
            {
                user: "{{agentName}}",
                content: { text: "HELLO_WORLD", action: "HELLO_WORLD" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Show me hello world" },
            },
            {
                user: "{{agentName}}",
                content: { text: "HELLO_WORLD", action: "HELLO_WORLD" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Print hello world" },
            },
            {
                user: "{{agentName}}",
                content: { text: "HELLO_WORLD", action: "HELLO_WORLD" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "I want to see hello world" },
            },
            {
                user: "{{agentName}}",
                content: { text: "HELLO_WORLD", action: "HELLO_WORLD" },
            },
        ],
    ] as ActionExample[][],
} as Action;
