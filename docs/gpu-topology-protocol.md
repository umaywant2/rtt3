# RTT/3 — GPU Topology Protocol

## 1. Purpose
Defines how RTT/3 ingests RTT/2 gpu-stack output and produces GPU topology
surfaces, intersections, and overlays.

## 2. Input Specification
Required:
- regimeView
- driftView
- coherenceView

## 3. Processing Rules
- deterministic mapping
- surfaces from coherence
- intersections from regime structure
- overlays from drift vectors

## 4. Output Specification
- surfaces[]
- intersections[]
- overlays[]

## 5. Error Codes
GT3-001: Invalid gpu-stack input

## 6. Version
2026.1
