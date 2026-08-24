# Ori Robotics API

Ori Robotics is an actual service boundary, not a UI simulation. The web application exposes authenticated HTTP endpoints that a Raspberry Pi or other robotics client can call directly.

## Authentication

Every robotics endpoint requires:

`Authorization: Bearer $ORI_ROBOTICS_API_KEY`

The server never returns the API key. If `ORI_ROBOTICS_API_KEY` is missing, the API reports configuration failure instead of silently accepting requests.

## Modes

Set `ORI_ROBOTICS_MODE` explicitly:

- `disconnected` (default): no hardware is attached. State is honest and physical commands are rejected.
- `mock`: commands execute only in a clearly labeled mock mode. No physical hardware is contacted.
- `real`: reserved for a configured hardware transport adapter. Until an adapter is installed, commands are rejected and nothing is sent to hardware.

There is no fake `connected=true` state.

## Endpoints

### `GET /api/robotics/health`

Authenticated service and connection health. Returns mode, connection state, configured model, and timestamp.

### `GET /api/robotics/state`

Authenticated structured robot state. In disconnected mode this returns an honest disconnected state with empty sensor/joint values rather than fabricated readings.

### `POST /api/robotics/command`

Accepts a validated high-level command. Current command schema supports `walk_to`, `turn`, `look_at`, `plan_route`, `climb_stairs`, and `stop_robot`.

The service validates numeric ranges before any transport can be called. A future hardware adapter must sit behind this boundary and remain responsible for low-level servo/motor control.

### `POST /api/robotics/perception`

Accepts real perception metadata (image payload, depth matrix, labels, or context) and sends the supplied information to the configured reasoning model. The model is not allowed to invent sensor facts.

### `POST /api/robotics/plan`

Uses the configured Qwen Mentor model through the Hugging Face router to produce a high-level plan and safety notes. Planner output is advisory; it is never a raw motor command.

## Physical robot connection

The Raspberry Pi should call the same HTTP endpoints as any other robotics client. The API is not dependent on browser state or frontend UI.

The missing piece before `ORI_ROBOTICS_MODE=real` can safely execute commands is a real hardware transport adapter for the robot's 12-servo controller and sensors. That adapter must implement actual connection, telemetry, command acknowledgement, timeout handling, and emergency stop behavior.

Until that adapter exists, the API deliberately refuses to pretend that hardware is connected.

## Developer-platform rule

Robotics belongs in the Developer Platform as an internal capability. It should not become a normal user-facing tab. The API itself remains independently callable by the physical robot.
