#!/usr/bin/env zsh
# Build the app, copy it to the IGL WordPress server, and tag the release.
# Run ./deploy.sh. It needs ssh access to the server.
set -euo pipefail

HOST=igl-website                       # requires alias in ~/.ssh/config
SITE=https://www.innovationgrowthlab.org
BASE=/tools/CHANGE-ME/                 # the URL path; deploy/.htaccess gets it too
TARGET=/var/www/html$BASE              # the same path on the server's disk

# Feature flags forced for the live site, whatever .env or .env.local says.
# Vite gives variables already in the environment priority over .env files.
# See src/flags.js for what each one covers. Add a project's own here, e.g.
# VITE_FLAG_BETA_PAGES=off for pages not ready to go live.
FLAGS=(
  # Fixed into the bundle, and would mark every visitor's hits as debug.
  VITE_FLAG_GA_DEBUG=off
)

cd "$(dirname "$0")"

die() { echo "$*" >&2; exit 1; }

[[ $BASE == *CHANGE-ME* ]] && die "Set BASE in deploy.sh to this project's path first."

# Deploy only what VERSION can name: a clean, pushed, untagged commit, which
# gets a new tag. --force skips the checks and the tag, to redeploy a tagged
# commit or try out uncommitted changes.
#
# --dry-run does everything except change the server or keep the tag: it
# builds, then lists what rsync would change on the server.
FORCE=
DRY_RUN=
for arg in "$@"; do
  case $arg in
    --force) FORCE=1 ;;
    --dry-run) DRY_RUN=1 ;;
    *) die "Usage: ./deploy.sh [--force] [--dry-run]" ;;
  esac
done

if [[ -z $FORCE ]]; then
  if [[ -n $(git status --porcelain) ]]; then
    die "Uncommitted changes. Commit them, or use --force."
  fi
  if [[ -z $(git branch -r --contains HEAD) ]]; then
    die "HEAD isn't pushed. Push it, or use --force."
  fi

  # Fetch tags so the tagged check and the next version see others' deploys.
  git fetch --tags --quiet
  TAGGED=$(git tag --points-at HEAD --list 'v*')
  if [[ -n $TAGGED ]]; then
    die "HEAD is already tagged $TAGGED. Use --force to redeploy it."
  fi

  # Suggest the next minor version, or v0.1.0 for the first tag. Edit it at the
  # prompt for a major or patch release.
  LAST=$(git tag --list 'v*' --sort=-v:refname | head -n 1)
  if [[ -z $LAST ]]; then
    NEXT=v0.1.0
  else
    IFS=. read -r MAJOR MINOR _ <<< "${LAST#v}"
    NEXT="v$MAJOR.$((MINOR + 1)).0"
  fi
  # if EDITOR=vim, backspace won't work on vared since .zshrc is skipped.
  bindkey -e
  TAG=$NEXT
  vared -p "Tag this deploy: " TAG

  # The quotes keep \. a literal dot; zsh strips the backslash otherwise.
  if [[ ! $TAG =~ '^v[0-9]+\.[0-9]+\.[0-9]+$' ]]; then
    die "Tag $TAG isn't like v1.2.3."
  fi

  # Tag before building, so VERSION names the tag. If anything fails before
  # the deploy finishes, remove the tag so a retry isn't blocked as tagged.
  git tag -a "$TAG" -m "Deploy $TAG"
  trap 'git tag -d "$TAG" >/dev/null' EXIT
fi

# The build needs the URL path to write correct asset links and to prerender.
# Vercel doesn't set it, so Vercel builds still serve from /.
#
# VITE_VERSION is available to the app as import.meta.env.VITE_VERSION (for a
# feedback link, say), and is also written to dist/VERSION, with the forced
# flags, to check what is live: curl $SITE${BASE}VERSION
VERSION="$(git describe --always --dirty --tags) $(date -u +%Y-%m-%dT%H:%MZ)"
echo "Building $VERSION with ${FLAGS[*]}"
env "${FLAGS[@]}" VITE_VERSION="$VERSION" VITE_BASE="$BASE" npm run build

sed "s|__BASE__|$BASE|g" deploy/.htaccess > dist/.htaccess
print -l "$VERSION" "${FLAGS[@]}" > dist/VERSION

if [[ -n $DRY_RUN ]]; then
  rsync -rv --delete --dry-run dist/ "$HOST:$TARGET"
  # Exiting here leaves the EXIT trap to remove the tag.
  echo "Dry run of $VERSION: nothing deployed, tag not kept."
  exit 0
fi

ssh "$HOST" mkdir -p "$TARGET"
rsync -rv --delete dist/ "$HOST:$TARGET"

# The deploy is live, so keep the tag and share it.
if [[ -z $FORCE ]]; then
  trap - EXIT
  git push --quiet origin "$TAG" \
    || die "Deployed, but pushing the tag failed. Run: git push origin $TAG"
fi

echo "Deployed $VERSION: $SITE$BASE"
