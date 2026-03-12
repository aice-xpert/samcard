export const content = `
SHA-256 underpins most of our digital security infrastructure—Bitcoin's blockchain, TLS certificates, password hashing, digital signatures. If it fell, the consequences would be catastrophic. So: can quantum computers break it?

The answer is nuanced, and the timeline is longer than most headlines suggest—but the preparation needed is real.

## What Quantum Attacks Actually Threaten

There are two distinct quantum threats to cryptography, and they're often confused:

**Grover's algorithm** can speed up brute-force search quadratically. Against SHA-256, this effectively halves security—from 256 bits to 128 bits. That's still considered secure for now, but NIST has recommended moving toward SHA-384 or SHA-512 for long-term security against this threat.

**Shor's algorithm** is the more dangerous one—it can factor large integers exponentially faster than classical algorithms. This directly threatens RSA and elliptic curve cryptography (the systems protecting TLS, email, and most public-key infrastructure). SHA-256 is a hash function, not a public-key system, so Shor's doesn't apply directly.

## The Timeline Question

Current quantum hardware is nowhere near capable of running Shor's algorithm at the scale needed to threaten real RSA keys. You'd need millions of logical qubits with low error rates. We have thousands of physical qubits with high error rates.

But "harvest now, decrypt later" attacks are real: adversaries can record encrypted traffic today and decrypt it once quantum hardware matures. Sensitive data with long secrecy requirements—medical records, government communications, financial transactions—is already at risk from this threat.

## The Post-Quantum Migration

NIST finalized its post-quantum cryptography standards in 2024. The selected algorithms—CRYSTALS-Kyber for key encapsulation, CRYSTALS-Dilithium for digital signatures—are designed to resist both classical and quantum attacks.

The migration will be one of the largest infrastructure upgrades in internet history. Most organizations haven't started. The time to begin planning is now, not when quantum computers become capable.

## What Bitcoin Specifically Faces

Bitcoin's hash function (SHA-256 for mining) is relatively quantum-resistant with the doubling of effective brute-force cost. The real vulnerability is in Bitcoin's use of ECDSA for transaction signatures—a Shor's-vulnerable public-key system. A sufficiently powerful quantum computer could, in theory, derive private keys from public keys exposed in transactions.

The Bitcoin community has been discussing quantum-resistant signature schemes for years. Migration would require a hard fork and community consensus. It hasn't happened yet.

The risk isn't imminent. But it's not hypothetical either.
`;
