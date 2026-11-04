# SAMIQ Platform — Parallel Agent Development & QA Guide

This document describes the parallel development, build, and QA workflow for the three template agents operating concurrently on the SAMIQ platform.

## Dedicated Agent Ports and Build Artifact Directories

To prevent build race conditions, port collisions, or cache invalidation conflicts across parallel agents, each theme agent must use its dedicated build directory (`NEXT_DIST_DIR`) and dedicated port:

| Theme ID | Port | Build Directory (`NEXT_DIST_DIR`) |
|---|---|---|
| `luxury-noir` | **3101** | `.next-luxury-noir` |
| `ivory-journal` | **3102** | `.next-ivory-journal` |
| `clinic-lab` | **3103** | `.next-clinic-lab` |

---

## Per-Agent Recipe (Build, Serve & QA)

For any agent working on `<theme-id>` (e.g. `luxury-noir`, `ivory-journal`, `clinic-lab`):

### 1. Build Production Bundle in Isolated Directory
On Linux/macOS/Bash:
```bash
NEXT_DIST_DIR=.next-<id> npm run build
```
On Windows PowerShell:
```powershell
$env:NEXT_DIST_DIR = ".next-<id>"
npm run build
```

### 2. Spawn Isolated Production Server
On Linux/macOS/Bash:
```bash
NEXT_DIST_DIR=.next-<id> npx next start -p <port>
```
On Windows PowerShell:
```powershell
$env:NEXT_DIST_DIR = ".next-<id>"
npx next start -p <port>
```

### 3. Run Objective Quality Assurance Harness
In a separate terminal or session:
```bash
npm run qa -- --theme=<id> --base-url=http://localhost:<port>
```

### 4. Cleanup
After completing QA verification, shut down the production server running on `<port>`. Never leave orphaned servers running.

---

## QA Output Isolation
- All QA screenshots and JSON test reports are automatically namespaced and saved under:
  ```
  qa-out/<theme>/
  ```
  ensuring agents never overwrite or conflict with each other's test artifacts.
