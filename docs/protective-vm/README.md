# The Protective V.M.

## Purpose

The Protective V.M. is a controlled Android investigation environment for examining the behavior of apps such as RCFPVPro before considering any connection to the user's drone. It is not a drone-control implementation and must not claim to understand activity it cannot observe.

## Product requirements

- Run a genuine Android guest in a landscape, desktop-sized workspace rather than presenting the project as a phone-shaped app.
- Reuse an established open-source Android baseline; do not build a new Android operating system from scratch.
- Keep the guest isolated from personal files and devices.
- Let Ori monitor observable guest and network activity, record evidence, explain alerts, and recommend or trigger containment under explicit rules.
- Enforce network policy outside the guest. The Android app must not be able to disable or override the network gate.
- Default-deny outbound connections. Allow only explicit, reviewed destinations and protocols. Unknown or policy-violating traffic is blocked and logged.
- Provide an independent emergency network cutoff that fails closed if the monitor or control service becomes unavailable.
- Treat geographic/IP-location rules as supplemental signals, not proof of operator identity or trust.
- Make monitoring limits visible. Encrypted traffic, hidden behavior, and activity unavailable to the host must be labeled as unobserved rather than guessed.
- Keep credentials server-side; never put VM or network-gate secrets in browser code or the repository.

## Proposed architecture

1. **Management interface** — the existing Ori web platform may provide status, policy, event history, and operator controls. Vercel is a possible host for this interface, not presumed to be the Android execution host.
2. **Android guest** — evaluate AOSP Cuttlefish first as a development-oriented virtual Android device. Compare it with Android-x86 or Bliss OS only if Cuttlefish cannot meet the desktop workspace or app-compatibility needs.
3. **Host supervisor** — starts/stops the guest, applies resource limits, captures supported logs, and reports truthful health status.
4. **Independent network gate** — a host-level firewall/proxy boundary with default-deny egress, explicit allow rules, append-only event records where practical, and a kill switch independent of the Android guest.
5. **Ori Safety Monitor** — correlates Android logs, permission/process signals where available, and network-gate events. Rules enforce deterministic containment; AI can help interpret evidence but must not be the sole safety control.
6. **Future local bridge** — a separately secured, opt-in connection path for laptop-to-drone Wi-Fi experiments. A cloud guest cannot directly join a drone's local Wi-Fi merely because the web interface is hosted online. Do not connect to the drone until guest isolation and network-cutoff behavior are established.

## First engineering milestone: feasibility, not a fake VM

Before implementing a dashboard that implies a working VM, establish whether a supported host can run the selected Android baseline with a desktop-sized display and whether the app can launch. Record requirements, resource needs, display/input access, and what activity can actually be observed.

Evaluate these questions:

- Can AOSP Cuttlefish run on the available host with the required virtualization and kernel features?
- Can the guest expose a controllable landscape desktop display and input channel?
- Can the host collect supported Android logs and enforce egress restrictions independently?
- Can the network gate reliably block traffic when the monitor process is stopped?
- Does RCFPVPro install and launch on the selected Android build? This is unknown until investigated.
- Can the runtime be operated affordably and safely? Do not assume Vercel Sandboxes are suitable for a persistent graphical Android emulator without a real feasibility check.

## Safety rules

- Initial network policy: no outbound access except explicitly approved test destinations.
- Never allow the guest to reach the host's management endpoints, cloud metadata endpoints, personal LAN, or other devices by default.
- A policy violation blocks the connection first, then records the reason and notifies the operator.
- If the safety monitor loses contact with the independent gate, the gate remains closed.
- No real drone connection during baseline validation. Test containment with synthetic traffic and a harmless test target first.
- Do not infer that traffic is safe solely because an IP geolocates to an approved country.
- Clearly distinguish observed facts, heuristics, and unknowns in all safety reports.

## Current status

**Design only.** No Android guest, network gate, monitor, or drone connection has been implemented by this document. The initial baseline candidate is AOSP Cuttlefish; host compatibility remains unverified.
