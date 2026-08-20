# Changelog

## v0.6.0 — 2026-08-20 (UX clarity)
- **fix**: Next clickable dot is now bright yellow with white border, scaled up, pulsing — impossible to miss
- **fix**: Lit (already clicked) dots are now dimmer so they don't compete for attention
- **fix**: Added bouncing 👆 pointer above the next dot

## v0.5.0 — 2026-08-20 (Polish & tracking)
- **feat**: Sound effects — ascending/descending click tones, disco beat on win
- **feat**: Haptic feedback on mobile (vibrate on tap, double-buzz on direction change, celebration pattern)
- **feat**: Direction change flash — text turns yellow and scales up when switching to backward
- **feat**: PWA support — installable on mobile with custom icon
- **feat**: Visitor counter badge (hitscounter.dev)
- **feat**: Build version tag at bottom (`build <hash> 🎯`)
- **feat**: Random inspirational quote shown during disco celebration (via DummyJSON API)
- **feat**: DummyJSON attribution link

## v0.4.0 — 2026-08-20 (Mobile fixes)
- **fix**: No-cache meta tags so users always get the latest version
- **fix**: Removed scroll — viewport locked with `overflow: hidden` + `h-screen`
- **fix**: Dots responsive: `w-10 h-10` on mobile, `w-16 h-16` on desktop
- **fix**: Gaps reduced on mobile to prevent clipping

## v0.3.0 — 2026-08-20 (Disco)
- **feat**: Disco celebration replaces confetti (spinning ball, light beams, floor tiles, pulsing dots)
- **feat**: Auto-reset after 6 seconds — no Play Again button needed

## v0.2.0 — 2026-08-20 (Upgrade)
- **chore**: Upgraded to Next.js 15.1 with Turbopack

## v0.1.0 — 2026-08-20 (Initial)
- **feat**: 5 Dots game — click dots 1→5 then 5→1
- **fix**: Next dot clearly clickable in both directions

---

## Known issues resolved
| Issue | Root cause | Fix |
|-------|-----------|-----|
| Users can't tell which dot to click going backward | "Next" dot was gray, looked disabled | Made next dot bright yellow + pulsing + pointer emoji |
| Page scrolls on mobile | `min-h-screen` allows overflow | Locked to `h-screen` + `overflow: hidden` on body |
| Dots clipped on small screens | Fixed 16x16 size too large | Responsive: 10x10 mobile, 16x16 desktop |
| Users see stale version after deploy | Browser cache | No-cache meta tags + hashed JS chunks |
| Visitor counter broken | hits.seeyoufarm.com is dead | Switched to hitscounter.dev |
