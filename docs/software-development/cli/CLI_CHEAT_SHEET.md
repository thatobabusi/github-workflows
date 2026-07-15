# CLI Cheat Sheet

Terminal fluency: the modern tool replacements, the one-liners, and the habits that compound.

## Modern Replacements

The house-standard upgrades (fast, sane defaults, better output):

| Classic | Modern | Why |
|---------|--------|-----|
| `grep -r` | **`rg`** (ripgrep) | 10–100× faster, respects .gitignore |
| `find` | **`fd`** | Sane syntax, fast, .gitignore-aware |
| `cat` | **`bat`** | Syntax highlighting, line numbers, git gutters |
| `ls -la` | `eza -la` | Colors, git status column |
| `cd ../../..` | `zoxide` (`z proj`) | Jumps by frecency |
| `diff` | `delta` | Readable side-by-side diffs |
| `curl` + jq | `httpie` (or keep curl) | Human-friendly requests |

Portability note: in interactive shells use the modern tools; in scripts that must run anywhere, stick to POSIX (`find`, `grep`, `sed`).

## Search & Find

```bash
rg "TODO" --type php                 # search only PHP files
rg -i "queue" -g '!vendor'           # case-insensitive, exclude dir
rg "class \w+Controller" -l          # filenames only
rg "old_name" -l | xargs sed -i 's/old_name/new_name/g'   # project-wide rename

fd '\.env' --hidden                  # find dotfiles too
fd -e log -x rm {}                   # find by extension and delete
fd . src/ -t f --changed-within 1d   # files changed today
```

## Pipes & Text Surgery

```bash
# The workhorse chain
history | rg docker | tail -20

# Columns: awk; edits: sed; unique counts: the classic trio
awk '{print $2}' access.log | sort | uniq -c | sort -rn | head   # top values
sed -n '10,20p' file.txt             # print lines 10–20
cut -d, -f1,3 data.csv               # CSV columns 1 and 3
tr '[:upper:]' '[:lower:]' < f       # lowercase everything

# JSON: jq
curl -s api/health | jq '.checks'
jq -r '.[] | "\(.id)\t\(.name)"' users.json
jq 'map(select(.active))' users.json
```

## Process & Port Forensics

```bash
# Who is holding port 8090?
netstat -ano | grep :8090            # Windows (then taskkill //F //PID n)
lsof -i :8090                        # macOS/Linux
kill -9 <pid>

ps aux | rg php                      # running processes
top / htop / btop                    # live view
time <command>                       # how long did it take
watch -n 2 'docker ps'               # rerun every 2s
```

## Files, Sizes, Archives

```bash
du -sh */ | sort -rh | head          # biggest directories
df -h                                # disk free
tar -czf backup.tar.gz dir/          # create   (Compress Ze File)
tar -xzf backup.tar.gz               # extract  (Xtract Ze File)
rsync -avz --progress src/ user@host:/dest/   # sync > scp (resumable)
```

## Shell Survival

```bash
# History
Ctrl+R           # fuzzy search history (transformative with fzf installed)
!!               # previous command       sudo !!
!$               # last argument of previous command

# Job control
command &        # background
Ctrl+Z, bg, fg   # suspend / background / foreground
jobs             # list

# Chaining
a && b           # b only if a succeeded
a || b           # b only if a failed
a; b             # both regardless

# Redirects
cmd > out.log 2>&1       # stdout+stderr to file
cmd 2>/dev/null          # discard errors
cmd | tee out.log        # screen AND file
```

## Safe Scripting Prelude

Every bash script starts:

```bash
#!/usr/bin/env bash
set -euo pipefail        # die on error, unset vars, and pipe failures
IFS=$'\n\t'

main() {
    local target="${1:?usage: script.sh <target>}"
    ...
}
main "$@"
```

- Quote every expansion: `"$var"`, `"$(cmd)"` — unquoted is the #1 script bug
- `shellcheck script.sh` in the [lint gate](../../LINTING_GATES.md) for any committed script
- Long-lived automation graduates from bash to a real language (Python/TS) at ~50 lines

## One-Liners Worth Stealing

```bash
# Biggest 10 files in repo history (before a force-push cleanup)
git rev-list --objects --all | sort -k2 | uniq -cf1 | sort -rn | head

# Total lines of code, respecting .gitignore
rg --files | rg '\.(php|js|py)$' | xargs wc -l | tail -1

# Watch a log for errors only
tail -f storage/logs/laravel.log | rg -i "error|exception"

# Quick HTTP server from any folder
python -m http.server 8090

# What changed in the last hour?
fd . -t f --changed-within 1h --exclude node_modules
```

## Windows Notes (Git Bash / PowerShell)

- Git Bash gives you the POSIX toolkit on Windows; `rg`/`fd`/`bat` install via scoop or winget
- Path separators: forward slashes work almost everywhere in Git Bash, including `D:/My Software Dev/...`
- `taskkill //F //PID <pid>` — double slashes in Git Bash (single in cmd/PowerShell)
- PowerShell equivalents worth knowing: `Get-ChildItem` (ls), `Select-String` (grep), `Get-Content -Tail 50 -Wait` (tail -f)

## See Also

- [Git Tips & Tricks](../../GIT_TIPS_TRICKS.md)
- [Docker Cheat Sheet](../docker/DOCKER_CHEAT_SHEET.md)
- [Nice to Know](../../NICE_TO_KNOW.md) — the gh CLI section
