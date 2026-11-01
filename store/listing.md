# Chrome Web Store listing

Paste these into the developer dashboard. Upload `dist/advertise-to-yourself-<version>.zip` (run `./build.sh`).

## Store listing tab

**Name:** Advertise to Yourself

**Summary:**
Replaces the new tab page with your own goals and the days left on each. Advertise to yourself.

**Description:**
Ads work because you see them constantly at the moments you're not focused, like opening a new tab. This replaces your new tab page with your own goals and deadlines, so the only thing advertised to you is what you actually want to get done.

- One line per goal: days left, then the goal.
- At most 3 goals show at once, nearest deadline first. The next one due is slightly brighter.
- Each goal has a "shows from" date and a due date. It appears on the first and disappears the day after the second.
- No notifications, no streaks, no accounts.
- Hover the bottom-right corner and click "edit" to add or change goals.
- Follows your system light/dark setting.

Goals are stored in Chrome's own sync storage. Nothing is sent anywhere else. Open source (MIT): https://github.com/rsktaker/advertise-to-yourself

**Category:** Productivity → Workflow & Planning
**Language:** English

**Graphic assets:**
- Store icon (128x128): `extension/icon-128.png`
- Screenshots (1280x800): `store/screenshot-1-dark.png`, `store/screenshot-2-light.png`, `store/screenshot-3-editor.png`
- Small promo tile (440x280): `store/promo-small-440x280.png`

**Homepage URL:** https://github.com/rsktaker/advertise-to-yourself
**Support URL:** https://github.com/rsktaker/advertise-to-yourself/issues

## Privacy tab

**Single purpose:**
Replaces the new tab page with a list of the user's own goals and the number of days left until each is due.

**Permission justification, storage:**
Saves the user's goals (title, start date, due date) with chrome.storage.sync so they persist between tabs and sync across the user's own Chrome browsers.

**Remote code:** No, I am not using remote code.

**Data usage:** Check none of the data types. Check all three certifications (no selling or transferring data to third parties, no use unrelated to the single purpose, no use for creditworthiness or lending).

**Privacy policy URL:** https://rsktaker.github.io/advertise-to-yourself/privacy.html

## Distribution tab

**Visibility:** Public. **Regions:** All regions. **Pricing:** Free.
