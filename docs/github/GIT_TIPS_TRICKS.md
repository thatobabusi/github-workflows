# Git Tips & Tricks

Power moves for daily git work. Each entry: what it does, when to reach for it.

## Recovery & Safety Nets

### Reflog — the undo button for everything

```bash
git reflog                        # every position HEAD has been at
git reset --hard HEAD@{2}         # jump back two moves
git branch rescue HEAD@{5}        # resurrect "lost" work onto a branch
```

Commits are almost never gone — a "deleted" branch or botched rebase is recoverable from reflog for ~90 days.

### Restore a single file from anywhere

```bash
git restore --source=HEAD~3 -- path/to/file.php    # from 3 commits ago
git restore --source=v1.2.0 -- config/app.php      # from a tag
git checkout other-branch -- src/helper.js         # from another branch
```

### Undo the last commit, keep the work

```bash
git reset --soft HEAD~1     # commit undone, changes staged
git reset HEAD~1            # commit undone, changes unstaged
```

## Precision Staging

### Stage hunks, not files

```bash
git add -p                  # interactively pick hunks: y/n/s(plit)/e(dit)
git restore -p              # discard hunks selectively
git stash -p                # stash only some hunks
```

The single biggest upgrade to commit hygiene — one logical change per commit even when your working tree is messy.

### Stash with intent

```bash
git stash push -m "wip: half-done refactor" src/    # only specific paths
git stash --include-untracked                       # bring new files too
git stash branch fix-branch stash@{0}               # stash → new branch
```

## History Archaeology

### Bisect — binary-search the breaking commit

```bash
git bisect start
git bisect bad                    # current commit is broken
git bisect good v1.2.0            # this tag was fine
# git checks out midpoints; test and mark each:
git bisect good|bad
git bisect reset

# Fully automated when you have a test command:
git bisect run npm test
```

Finds the culprit in log₂(n) steps — 1000 commits ≈ 10 tests.

### Who changed this, and why

```bash
git log -L 15,40:src/app.js       # history of lines 15–40 only
git log -S "functionName" --oneline    # commits that add/remove the string
git log --follow -- path/file.js  # history across renames
git blame -w -C -C -C file.js     # ignore whitespace, track moved code
```

### What happened while I was away

```bash
git log --oneline --since="2 days ago" --all
git diff main@{yesterday} main    # what changed on main since yesterday
```

## Parallel Work

### Worktrees — multiple branches checked out at once

```bash
git worktree add ../project-hotfix hotfix/urgent-fix
# work in ../project-hotfix with full checkout, same repo
git worktree remove ../project-hotfix
git worktree list
```

No stash-switch-stash dance: review a PR, run a long test suite, or cut a hotfix in a second directory while your feature branch stays untouched.

### Rerere — never re-resolve the same conflict

```bash
git config --global rerere.enabled true
```

Git records how you resolved a conflict and replays it automatically the next time the same conflict appears (long-lived branches, repeated rebases).

## Cleanups & Rewrites

### Autosquash workflow

```bash
git commit --fixup=abc1234        # marks the commit as a fix for abc1234
git rebase -i --autosquash main   # auto-reorders and squashes fixups
```

Fix review findings as `fixup!` commits; history collapses cleanly at merge time.

### Prune everything stale

```bash
git fetch --prune                             # drop deleted remote branches
git branch --merged main | grep -v main | xargs git branch -d   # merged locals
git remote prune origin
```

## Config Quality-of-Life

```bash
# Better diffs on moved code
git config --global diff.colorMoved zebra

# Sort branches by recency
git config --global branch.sort -committerdate

# Push the current branch without naming it
git config --global push.autoSetupRemote true

# Reuse one global identity, override per folder
# ~/.gitconfig:
[includeIf "gitdir:D:/Work/client-x/"]
    path = ~/.gitconfig-client-x
```

### Aliases that earn their keep

```bash
git config --global alias.lg "log --oneline --graph --decorate -20"
git config --global alias.st "status -sb"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.amend "commit --amend --no-edit"
git config --global alias.uncommit "reset --soft HEAD~1"
```

## Windows-Specific

- `core.autocrlf=true` on Windows silences the LF/CRLF warnings and keeps LF in the repo
- Add a `.gitattributes` so line endings are repo-controlled, not machine-controlled:

```
* text=auto
*.sh text eol=lf
*.yml text eol=lf
```

- Long path errors: `git config --global core.longpaths true`

## See Also

- [Commit Standards](COMMIT_STANDARDS.md)
- [Branching Strategy](BRANCHING_STRATEGY.md)
- [Actions Advanced](ACTIONS_ADVANCED.md)
