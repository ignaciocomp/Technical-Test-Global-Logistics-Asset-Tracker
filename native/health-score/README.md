# Health Score Native Library

ANSI C shared library that computes a health score (0–100) from sensor telemetry data.

## Scoring Logic

Starts at 100 and applies penalties:

| Sensor      | Ideal Range | Penalty                    |
|-------------|-------------|----------------------------|
| Temperature | 15–35 °C    | 1.5 pts per degree outside |
| Pressure    | 50–120 units| 1.0 pts per unit outside   |
| Vibration   | ≤ 30 units  | 2.0 pts per unit above 30  |

Final score is clamped between 0 and 100.

## Build

```bash
make            # produces libhealth_score.so
```

## Test

```bash
make test       # compiles and runs test_main.c
```

## Integration

The .NET backend calls this library via P/Invoke:

```csharp
[DllImport("health_score", CallingConvention = CallingConvention.Cdecl)]
static extern double calculate_health_score(double temperature, double pressure, double vibration);
```

At runtime, the .NET host resolves `health_score` to `libhealth_score.so` on Linux.
If the library is not found, the C# service falls back to a managed implementation.

## Requirements

- GCC with ANSI C support
- Linux (shared library target is `.so`)
