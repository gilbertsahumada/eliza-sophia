import {
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import {
    createPublicClient,
    http,
    formatEther,
    parseAbi,
    formatUnits,
} from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
    chain: mainnet,
    transport: http(),
});

// Función para generar un ID único
export function generateId(): `${string}-${string}-${string}-${string}-${string}` {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    ) as `${string}-${string}-${string}-${string}-${string}`;
}

function extractEthereumAddress(text: string): string | null {
    const ethAddressRegex = /0x[a-fA-F0-9]{40}/g;
    const matches = text.match(ethAddressRegex);
    return matches ? matches[0] : null;
}

export const ethereumWalletAction: Action = {
    name: "CHECK_BALANCE",
    similes: ["CHECK_WALLET", "VIEW_BALANCE", "ETH_BALANCE"],
    description: "Check your Ethereum wallet balance",

    validate: async (_agent: IAgentRuntime, memory: Memory, _state?: State) => {
        const text = memory.content.text;
        return extractEthereumAddress(text) !== null;
    },
    handler: async (
        agent: IAgentRuntime,
        memory: Memory,
        _state?: State,
        _options?: any,
        callback?: HandlerCallback
    ) => {
        try {
            const address = extractEthereumAddress(
                memory.content.text
            ) as `0x${string}`;
            const balance = await client.getBalance({
                address: address,
            });

            if (!address) {
                callback(
                    {
                        text: "Invalid Ethereum address",
                    },
                    []
                );
                return false;
            }

            const ethBalance = formatEther(balance);

            const blockNumber = await client.getBlockNumber();
            const block = await client.getBlock({ blockNumber });

            // Crear memoria con la informacion
            await agent.documentsManager.createMemory({
                id: generateId(),
                userId: memory.userId,
                agentId: memory.agentId,
                content: {
                    text: `Your Ethereum wallet balance is ${ethBalance.toString()} ETH`,
                    action: "CHECK_BALANCE",
                    address: address,
                    balanceWei: balance.toString(),
                    balanceEth: ethBalance.toString(),
                    lastUpdated: block.timestamp.toString(),
                    blockNumber: blockNumber.toString(),
                },
                roomId: memory.roomId,
            });
            callback(
                {
                    text: `Your Ethereum wallet balance is ${ethBalance.toString()} ETH`,
                },
                []
            );
            return true;
        } catch (error) {
            console.log("Error checking wallet : ", error);
            callback(
                {
                    text: "Error checking wallet",
                },
                []
            );

            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "My name is Gilberts. Check my balance!" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Let me check your balance!",
                    action: "CHECK_BALANCE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Can you check my balance?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Sure, Let me check your balance!",
                    action: "CHECK_BALANCE",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;

export const tokenAnalyzerAction: Action = {
    name: "ANALYZE_TOKENS",
    similes: ["CHECK_TOKENS", "VIEW_TOKENS", "TOKEN_ANALYSIS"],
    description: "Analyze the tokens ERC20 of an Ethereum wallet",
    validate: async (_agent: IAgentRuntime, memory: Memory, _state?: State) => {
        const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
        const text = (memory.content as any).text;
        return ethAddressRegex.test(text);
    },
    handler: async (agent: IAgentRuntime, memory: Memory, _state?: State) => {
        try {
            const address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; //memory.content.text as `0x${string}`;

            // ABI mínimo para tokens ERC20
            const erc20Abi = parseAbi([
                "function balanceOf(address) view returns (uint256)",
                "function decimals() view returns (uint8)",
                "function symbol() view returns (string)",
            ]);

            const commonTokens = [
                {
                    address:
                        "0xdAC17F958D2ee523a2206206994597C13D831ec7" as `0x${string}`, // USDT
                    symbol: "USDT",
                    decimals: 6,
                },
                {
                    address:
                        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`, // USDC
                    symbol: "USDC",
                    decimals: 6,
                },
            ];

            let tokenBalances: {
                symbol: string;
                balance: string;
                rawBalance: string;
                address: `0x${string}`;
                decimals: number;
            }[] = [];

            for (const token of commonTokens) {
                const balance = await client.readContract({
                    address: token.address as `0x${string}`,
                    abi: erc20Abi,
                    functionName: "balanceOf",
                    args: [address],
                });

                if (balance > 0n) {
                    const formattedBalance = formatUnits(
                        balance,
                        token.decimals
                    );

                    tokenBalances.push({
                        symbol: token.symbol,
                        balance: formattedBalance,
                        rawBalance: balance.toString(),
                        address: token.address,
                        decimals: token.decimals,
                    });
                }
            }

            const blockNumber = await client.getBlockNumber();

            // Crear memoria con la informacion
            await agent.documentsManager.createMemory({
                id: generateId(),
                userId: memory.userId,
                agentId: memory.agentId,
                content: {
                    text: `Análisis de tokens completado. Encontrados ${tokenBalances.length} tokens`,
                    walletAddress: address,
                    blockNumber: blockNumber.toString(),
                    tokens: tokenBalances,
                    timestamp: Date.now(),
                },
                roomId: memory.roomId,
            });

            return true;
        } catch (error) {
            console.log("Error analyzing tokens : ", error);
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "0x5ee75a1B1648C023e885E58bD3735Ae273f2cc52",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I will analyze your tokens",
                    action: "ANALYZE_TOKENS",
                },
            },
        ],
    ],
};
