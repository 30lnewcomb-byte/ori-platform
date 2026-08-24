# Ori Robotics Architecture

Ori Robotics is the embodied-intelligence layer of Ori Platform. It connects Ori's reasoning systems to a physical robot without making the robot's hardware drivers part of the web UI.

## Architecture

```text
Ori Platform
├── Ori Core / TensorFlow intelligence
├── Qwen Mentor
├── Private Sandbox
├── Ori Robotics API
│   ├── State
│   ├── Perception
│   ├── Motion
│   ├── Navigation
│   └── Safety boundary
└── Physical Robot
    ├── Raspberry Pi controller
    ├── 12 smart servo joints
    ├── foot-contact sensors
    ├── RGB/depth perception
    ├── voice I/O
    └── future arm
```

## Design rule

High-level models may reason about perception, goals, routes, and actions. They must **not directly drive motors**. All hardware commands pass through the local robotics control layer, which validates state, limits, contact conditions, and emergency-stop state before executing an action.

Gemini Robotics or another capable vision/reasoning model can eventually provide high-level spatial reasoning and planning. It remains a planner, not the motor controller.

## Capability contract

The first stable API should expose capabilities rather than hardware-specific implementation details:

- `get_robot_state()` — battery, mode, faults, pose estimate, joint summary.
- `get_camera_frame()` — current visual observation.
- `get_depth_data()` — current depth observation or a bounded representation.
- `get_foot_contacts()` — contact state for each foot.
- `get_joint_states()` — positions, velocities, and health for joints.
- `walk_to(target)` — request a validated locomotion goal.
- `turn(angle)` — request a validated turn.
- `look_at(target)` — request a validated head/camera goal.
- `plan_route(target)` — produce a route without executing it.
- `climb_stairs(plan)` — request a stair-climbing plan that must pass local safety checks.
- `stop_robot(reason)` — highest-priority stop request.

These are contracts, not permissions for a language model to bypass the controller.

## Execution boundary

```text
Reasoning / planning
        |
        v
Robotics command contract
        |
        v
Local safety + state validation
        |
   +----+----+
   |         |
 reject     execute
             |
             v
        hardware driver
```

The web platform should be able to observe and request robotics operations, but the physical robot should remain capable of stopping safely if the network, model, or platform becomes unavailable.

## Initial implementation order

1. Define typed robotics state and command schemas.
2. Implement a local mock robot so the API can be tested without hardware.
3. Add the real Raspberry Pi adapter behind the same interface.
4. Add perception adapters for RGB/depth and foot contacts.
5. Add planner integration as an advisory/high-level layer.
6. Add telemetry and event history.
7. Only then expose selected robotics capabilities to Ori's Sandbox/agent tooling.

The robotics layer should remain an internal platform capability. It does not need to become a visible top-level user tab merely because the platform supports it.
