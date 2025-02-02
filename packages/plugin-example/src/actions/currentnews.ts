import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action,
} from "@elizaos/core";

async function getCurrentNews(searchTerm: string) {
    const url = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.articles.slice(0, 5).join("\n");
}

export const currentNewsAction: Action = {
    name: "CURRENT_NEWS",
    similes: ["NEWS", "GET_NEWS", "GET_CURRENT_NEWS"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: "Get the current news",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        _callback: HandlerCallback
    ): Promise<boolean> => {
        const searchTerm = "ai16z";
        const currentNews = await getCurrentNews(searchTerm);

        _callback({
            text: `The current news for ${searchTerm} are ${currentNews}`,
        });
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "What's the latest news?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "The current news for ai16z are ...",
                    action: "CURRENT_NEWS",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Show me the current news" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "The current news for ai16z are ...",
                    action: "CURRENT_NEWS",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Get the latest news" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "The current news for ai16z are ...",
                    action: "CURRENT_NEWS",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "News update" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "The current news for ai16z are ...",
                    action: "CURRENT_NEWS",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Tell me the news" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "The current news for ai16z are ...",
                    action: "CURRENT_NEWS",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
