export const content = `
90 days. That's the constraint I gave myself. Build something real, find paying customers, and ship it—all in the time most teams spend in planning meetings.

Here's what I learned.

## Days 1–14: Validate Before You Build

The most expensive thing you can do in blockchain is build something nobody wants. I spent the first two weeks doing exactly one thing: talking to potential customers.

I identified 20 people in my target market (small-to-medium DeFi protocol operators) and asked to interview them about their workflow. Not pitching, not showing demos—asking questions. Three problems came up repeatedly: smart contract audit costs, liquidity monitoring overhead, and regulatory reporting complexity.

I picked liquidity monitoring because it was the most acutely painful and had the clearest shape of a software solution.

## Days 15–45: Build the Ugly Version

The first version of your product should embarrass you a little. Mine was a dashboard with three charts and two alert types. No fancy tokenomics, no governance features, no native token at all. Just: here's your liquidity across your pools, here's an alert when it drops below your threshold.

I used Wagmi and Viem for the blockchain interaction layer, Next.js for the frontend, and a simple Supabase backend. Total smart contract surface: zero. The product was entirely off-chain infrastructure.

## Days 46–60: Charge Something, Even If It's Small

On day 46, I sent a message to the five most engaged people from my validation interviews: "I've built the liquidity monitoring tool we talked about. Would you pay $99/month to use it?"

Three said yes immediately. Two asked for demos. That was enough.

Early revenue isn't about the money—it's about the signal. Paying customers tell you things free users never will.

## Days 61–90: Iterate on Pain, Not Features

With five paying customers, I had a focused development agenda: fix what's broken, add what they specifically ask for, and nothing else.

The temptation is to build the grand vision. Resist it. The product that exists in 90 days will be wrong about many things. The customers will tell you which things. Listen to them.

By day 90, I had 12 paying customers at $99/month: $1,188 MRR. Not life-changing, but proof the thing works.
`;
