export const content = `
SHA-256 is in almost everything. It secures Bitcoin transactions, validates TLS certificates, protects password databases, and underpins Git's entire version history. So when people ask whether quantum computers can break it, the answer they usually get is either "yes, we're all doomed" or "no, stop panicking." Both are wrong.
 
The real answer is more specific — and the specifics matter.

## What SHA-256 Actually Does
 
SHA-256 is a hash function. Feed it any input — a file, a password, a transaction record — and it produces a fixed 256-bit output called a digest. The function is one-way: given only the digest, there's no known mathematical path back to the original input. You'd have to guess.
 
For an attacker trying to reverse a hash or find two inputs that produce the same digest, a classical computer faces a search space of 2^256 possible values. That number is large enough to be practically meaningless. A classical brute-force attack on SHA-256 isn't a realistic threat with any hardware that exists or is being planned.
 
Quantum computers change the math — but less dramatically than most coverage implies.

## Grover's Algorithm: What It Does and Doesn't Do
 
The relevant quantum algorithm is Grover's. On a quantum computer, it can search an unsorted space of N items in roughly √N steps instead of N. Applied to SHA-256, this theoretically cuts the effective security from 256 bits down to 128 bits.
 
128 bits is still considered secure. NIST classifies 128-bit security as acceptable for most applications. Even with a fully functional large-scale quantum computer running Grover's algorithm, SHA-256 doesn't collapse — it gets weaker, but it doesn't break. For comparison, 3DES with 112-bit effective security has already been deprecated. SHA-256 at quantum-reduced strength is still above that bar.
 
So the headline "quantum computers will break SHA-256" is technically misleading. What's accurate is: a large enough quantum computer would halve SHA-256's effective security. That's worth knowing. It's not the same as breaking it.

## The Part That's Actually Broken: Shor's Algorithm
 
Here's where the real problem lives — and where most of the confusion comes from.
 
Shor's algorithm is a different quantum algorithm entirely. It can factor large integers and solve discrete logarithm problems exponentially faster than any classical method. This breaks RSA and elliptic curve cryptography outright. Not weakens — breaks.
 
Bitcoin's ECDSA signatures, HTTPS connections, SSH keys, and most public key infrastructure rely on elliptic curve or RSA-based cryptography. A quantum computer running Shor's algorithm at scale could forge transaction signatures, impersonate servers, and drain wallets — not by reversing hashes, but by attacking the signature schemes sitting alongside them.
 
This distinction is important. Bitcoin's proof-of-work mining (the hashing part) is relatively resistant to quantum attack. Bitcoin's wallet ownership proof (the ECDSA signature part) is not. An attacker with a sufficiently powerful quantum computer probably couldn't cheaply reverse SHA-256 mining, but they could potentially sign transactions on behalf of wallets they don't own.
 
I find this distinction gets lost constantly in mainstream coverage. People hear "quantum computers threaten Bitcoin" and assume it's about the hashing. It's mostly about the signatures.

## How Far Away Is "Sufficiently Powerful"?
 
Honestly, nobody knows — and anyone who claims certainty in either direction is probably selling something.
 
Running Grover's algorithm against SHA-256 at scale would require millions of logical qubits with very low error rates. Physical qubits and logical qubits aren't the same thing: error correction overhead means you might need roughly 1,000 physical qubits per logical qubit for fault-tolerant computation. IBM's current best processors have thousands of physical qubits. The gap between where we are and where we'd need to be is large.
 
A 2022 paper by Mark Webber and colleagues estimated that breaking Bitcoin's elliptic curve encryption within one hour would require about 317 million physical qubits. Current machines have fewer than 10,000.
 
That said, the field isn't standing still. Progress on error correction has been real and steady over the past few years. Most cryptographers estimate we're 10 to 30 years from quantum computers that can attack current cryptographic systems at scale. Some say less. Nobody credible says next year.
 
The wide range isn't intellectual laziness — it reflects genuine uncertainty about engineering timelines for a technology that keeps hitting unexpected walls and unexpected breakthroughs.

## The Threat Nobody Talks About Enough: Harvest Now, Decrypt Later
 
The distant timeline is somewhat reassuring for most use cases. It's less reassuring if you're protecting data that needs to stay secret for 20 years.
 
"Harvest now, decrypt later" is exactly what it sounds like. Adversaries collect encrypted communications and stored data today, archive it, and plan to decrypt it once quantum hardware matures. For government communications, medical records, financial transaction histories, and long-lived infrastructure secrets, this is already a practical concern — not a future one.
 
If you're encrypting something today that still needs to be secret in 2040, the quantum threat is already here. The encrypted data just hasn't been decrypted yet.

## What's Being Done About It
 
NIST finalized its first post-quantum cryptographic standards in 2024. CRYSTALS-Kyber handles key encapsulation; CRYSTALS-Dilithium handles digital signatures. Both are designed to resist attacks from both classical and quantum computers. The standards are real and the libraries are being written.
 
Migration is the hard part. These aren't drop-in replacements for RSA or ECC — they have different key sizes, different performance characteristics, and swapping them into existing systems requires real engineering work. In some cases, a lot of it.
 
The blockchain world has an additional problem. Changing a consensus-critical cryptographic primitive in a live network like Bitcoin requires broad community agreement, months of testing, and a hard fork. It's doable. It's not fast. And the conversation hasn't really started in earnest.
 
## So Should You Actually Worry?
 
SHA-256 specifically? Not urgently. The Grover reduction is real, but 128-bit security holds up for most foreseeable scenarios.
 
The public key cryptography next to SHA-256 — the RSA and ECDSA pieces? That's a different story, and most of the infrastructure we depend on hasn't started migrating.
 
If you're building a system today that needs to last 15+ years, post-quantum cryptography isn't theoretical planning anymore. NIST published the standards. The migration path exists. The question is just whether organizations start moving before the timeline gets uncomfortable, or after.
 
History suggests most will wait until after.
 
`;

export const timeline = [
  "SHA-256 isn't broken by quantum computers — Grover's algorithm only halves its effective security to 128 bits",
  "The real quantum threat targets ECDSA signatures, not hashes — wallet ownership proofs are more exposed than mining",
  "Cryptographically relevant quantum computers are likely 10–30 years away, but the engineering gap is closing",
  "Harvest-now-decrypt-later attacks are already a concern for data that needs to stay secret beyond 2035",
  "NIST finalized post-quantum standards in 2024 — migration is an engineering problem now, not a research one",
];
