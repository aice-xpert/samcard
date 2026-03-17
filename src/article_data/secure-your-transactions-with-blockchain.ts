export const content = `
$3.4 billion stolen in 2025 across blockchain protocols. The number is staggering, and it's almost entirely preventable. Here's what every team deploying blockchain infrastructure needs to understand about security in 2026.

## Smart Contract Security Is Non-Negotiable

The majority of large-scale blockchain hacks exploit smart contract vulnerabilities—reentrancy attacks, integer overflow, access control failures, and oracle manipulation. These aren't exotic techniques. They're well-documented, and yet they're reproduced in production contracts constantly.

**Minimum security baseline for any smart contract holding user funds:**

Formal verification for critical paths. At least two independent audits from reputable firms (not one). An economic audit—security firms check code; economic auditors check whether your incentive structures create attack surfaces. Bug bounty programs before launch, not after an exploit.

## Private Key Management Is Where Most Individual Losses Happen

Protocol-level exploits make headlines. Private key compromises cause more aggregate losses. The attack surface is enormous: phishing, malware, hardware failure, and social engineering all target key management.

Hardware wallets for any meaningful holdings. Multi-sig for anything held by an organization. Air-gapped signing environments for very large positions. Never store seed phrases digitally. These practices are table stakes.

## The Auditing Gap

There's currently more capital looking for smart contract audits than there is auditing capacity. Lead times at top firms run 3–6 months. Budget for this early in your development timeline—finding out six months before launch that you can't get audited when you planned to launch is a costly mistake.

## On-Chain Monitoring Saves What Prevention Misses

No security architecture is perfect. Real-time on-chain monitoring—watching for unusual transaction patterns, liquidity movements, and known exploit signatures—allows teams to pause contracts and limit damage when something goes wrong.

Services like Chainalysis, Forta, and OpenZeppelin Defender provide this infrastructure. Use them.

Security isn't a feature. It's the foundation.
`;

export const timeline = [
	"Start with a threat model for wallets, contracts, and user flows",
	"Apply least-privilege access and hardware-backed key storage",
	"Run automated tests and audits before every contract upgrade",
	"Monitor live transactions for exploit and anomaly patterns",
	"Practice incident response with rollback and communication playbooks",
];
