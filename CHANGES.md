# 1.0.2-beta.1
## 🌟 Features
- Added tables: headers, custom background colors and resize included
- Images are now included in note exports
- Added PDF export
- Added icon and title to exported documents

## ✨ Improvements and fixes
- Added a tooltip on note list items for better accessibility
- Improved HTML serialization
- Fixed checkbox styling in exports
- Fixed recursive render crash in highlight color picker


# 1.0.1-beta.1
## ✨ Improvements and fixes
- Trashed pages can now be viewed/edited before restoring them
- "Check for updates" option in the about screen now works
- I had forgotten to bump the version in 1.0.0-beta.2, which showed unnecessary update notifications. This has been fixed in this release

# 1.0.0-beta.2
## 🚑 Hotfixes
- Fixed failing migration checks on Windows 11 25H2 due to the removal of WMIC utility.
- Added additional guards to ensure data is not lost during migrations.

# 1.0.0-beta.1
## 🌟 Features
- Introducing workspaces
  - Stay organized with a space for each of your projects
  - Workspaces cannot be deleted for now, this will be introduced in the upcoming patches
- UI rebuild and refresh
- .deb package
- Brand new architecture
- New theming system
  - Choose a color scheme for light and dark mode individually
  - Darkwrite can now follow your system color scheme
- New settings format
- Add ability to zoom in/out through menu
- HTML exports are now styled
- Added JSON export and import
- `⎇ +b` now toggles sidebar
- `⎇ +←` now navigates back
- `⎇ +→` now navigates forward
- Code block syntax highlighting now follows theme colors
- Onboarding

## ✨ Improvements and fixes
- Add missing translations for various places
- Improve note ordering performance by dropping index based ordering
- New icon
- Make the default theme darker
- Fixed full width pages
- You can now choose choose fonts from your system font list without having to type its name
- Multiple HTML, JSON and Markdown files can now be imported at once

# 0.5.3-alpha.2
## 🌟 Features
- Add support for text colors and highlighting (#3, #5)
  - There are 9 colors available by default, and these follow your theme
  - It's also possible to choose a custom color using the eyedropper button

## ✨ Improvements and fixes
- Removed old editor code, which reduced the app size by ~1MB

# 0.5.2-alpha.2
## 🌟 Features
- Upgraded code blocks with syntax highlighting.
- Clicking on the empty space below the editor contents now moves the cursor to the end.

## ✨ Improvements and fixes
- We have rebuilt the editor from the ground up and extracted it into a new package.
You should not notice much difference at first sight other than the new slash menu animation,
however this changes a lot under the hood stuff and will speed up development in the long run.

# 0.5.1-alpha.2
## ✨ Improvements and fixes
- Fixed a bug which showed the "Darkwrite is up to date" toast on every automatic update check. This toast now appears only when you check for updates explicitly.

## 🛠️ Technical changes
- Upgraded `react-router-dom` and `vite` to address dependabot alerts
- Upgraded `@radix-ui/react-dropdown-menu` to fix broken unit tests

# 0.5.1-alpha.1

## 🌟 Features
- Added update checks on startup. **To protect your privacy, it is disabled by default, but you can enable it in settings.**
- - It makes a request to the GitHub API to get the latest release. Although we already developed a server to check for updates, we decided to use the GitHub API for now. 

## ✨ Improvements and fixes
- Hitting enter after editing a link's URL now saves the link
- Fixed editor contents going off screen as window got narrower

# 0.5.0-alpha.1

## 🌟 Features

- Added trash search
- Added back and forward buttons
- Added wide pages
- Heading 4 is now in slash command menu (it wasn't there even though it existed)
- You can now drag notes into the trash

## ✨ Improvements and fixes

- Input focus rings now follow accent color
- Fixed tab order in sidebar
- Reduced transparency in menus to improve readability
- Fix incorrect UI font issue in some elements when using system default
- Translated more UI elements, notably the slash command menu
  - All command descriptions have been rewritten for both English and Turkish.
- Fixed image drop not working

## 🛠️ Technical changes

- shadcn-ui components now live in a separate package.
- Added environment variable `DARKWRITE_ROOT_OVERRIDE` to use a different profile folder.
  - I added this to share profiles in my dual boot setup. Actual workspace/profile switching will be added later as a feature.

# 0.4.0-alpha.3

## ✨ Improvements and fixes

- Fixed the bug which prevented you from creating child items in lists (sinking list items) by hitting Tab
- Fix links to pages being unreadable inside blockquotes

# 0.4.0-alpha.2

## 🚨 This update fixes the image upload issues in v0.4.0-alpha.1

# 0.4.0-alpha.1

## 🌟 Features

- You can now toggle todo, bullet and numbered lists directly from the floating menu
- Added block quote button to floating menu
- Word count can now be always shown in the bottom-right corner of the window. (You can enable or disable it in settings)
- Upgraded code blocks
  - Hitting `⇥Tab` inserts a desired number of spaces for indentation
  - Hitting `⬇️Down Arrow` at the last line exits the code block
  - Hitting `Ctrl/Cmd` + `⬇️Down Arrow` exits the code block immediately, even if you are on the first line

## ✨ Improvements and fixes

- Fixed 7 places where notes without icons were handled incorrectly
- Added translations for note customization menu
- Fixed issue causing system accent color to be always black
- Updated settings UI style

## 🛠️ Technical changes

- We developed tools around IPC to accelerate API development and ensure type-safety.
- Moved built-in themes to `@darkwrite/common`

# 0.3.1-alpha.3

## 🌟 Features

- Added markdown import

## ✨ Improvements and fixes

- Notes no longer have an icon by default, you can add or remove it as you wish

# 0.3.0-alpha.2

> Quality of life release before moving onto 1.0.0-alpha

## 🌟 Features

- Added `Ctrl+n` (or `Cmd+n` on macOS) shortcut to create new notes
- Changed icon for development builds

# 0.3.0-alpha.1

## 🌟 Features

- You can now paste images directly to the editor
- You can now drop image files directly. You can drop more than one image and all of them will be inserted to the page.
- Links can now be edited
- Editor now has a context menu
- Added word count - you can view it by clicking the menu icon on the top right.
- Added translations for Turkish
- Images are now centered
- Add undo and redo options to editor menu (it was possible to perform these with keyboard shortcuts previously)
- Added option to follow system accent color on Windows and macOS

## ✨ Improvements and fixes

- Removed the empty space to the right side of color pickers
- Displaying dates in the recent notes view now follows correct locale
- Added background blur to context menus, dropdowns, popovers and search
- Disabled dropping into the title box, which should prevent you from accidentally dropping nodes there
- Fixed low-resolution desktop icon on Windows.
- Fixed inability to interact with other things when heading selector in the bubble is open

# 0.2.0-alpha.4

## ⚠️ Minor breaking change

- This release changes the directories in which Chromium session data is stored. This change means the following preferences will be lost:
  - Sidebar width
  - Whether sidebar was hidden or not
  - Whether spell checking was disabled or not
- As these are local preferences and are not even persisted in backups, it shouldn't be a problem.

## 🌟 Features

- When you collapse favorites or all notes views in the sidebar, that preference will be remembered

## ✨ Improvements and fixes

- Fixed a bug where "this note is trashed" alert would go below the cover image
- Chromium session data is now stored in directories called `session-dev/` and `session/` when running development and production builds respectively.
- Added padding to editor's sides to make drag handles more accessible
- Reduced margins above headings
- Reduced padding between title and the page
- Fixed the use of wrong destructive color in Catppuccin Frappé (it's not blue anymore)
- Fixed a bug causing the emoji picker to always appear in dark mode, which caused unreadable text in light themes
- Fixed a bug where exporting empty notes would fail when done from the context menu or the editor menu
- Fixed a bug which caused trash contents to overflow down the container
- Trash panel now has a bottom margin which prevents it from sticking close to the bottom
- Top left corner of the editor is no longer rounded when sidebar is collapsed
- Fixed a bug where changing the text color of a note would affect icons in formatting bubble
- Fixed a bug where changing the text color of a note would also change the color of cover image buttons
- Increased startup window size to 1000x700

# 0.2.0-alpha.3

## 🌟 Features

- Added striked text
- Added image support
- Added cover images

## ✨ Improvements and fixes

- Titlebar buttons now have an active style
- Fixed nodes being dragged using the wrong background style
- Hitting down arrow on the note title now moves the cursor to the editor
- Fixed code blocks using the wrong font
- Added a divider below the title text

# 0.2.0-alpha.2

## 🌟 Features

- Added option to use native window frame
- Added option to use custom window frame on macOS as an experimental feature
- Notes can have custom background/text colors

## ✨ Improvements and fixes

- Fixed potential performance issues when typing on the custom font box
- Reworked note customization UI so it's not obnoxious anymore
- Headings now follow the theme better

# 0.2.0-alpha.1

## ⚠️ Breaking changes

- Directories in which application data is stored has changed. App data will be stored in a subdirectory named `darkwrite-data` when running production builds, and `darkwrite-data-nightly` when running development builds. If you are upgrading from 0.1.0-alpha.x, navigate to Darkwrite's data directory (you can use the application menu for this), move `data.db`, `settings.json` and `notes/` into `darkwrite-data/`.
- Alternatively, create a backup before upgrading and restore from the backup after upgrading.

## 🌟 Features

- Import and use custom themes
- New dark themes: Catppuccin Macchiato, Frappé
- New light themes: Catppuccin Latte (experimental)
- Themes can now define the color for favorite stars

## ✨ Improvements and fixes

- New backups now include a date in their file names by default.
- Tweaked emoji picker styles to better follow theme preferences
- Fixed overflow of file chooser button in restore dialog when a long path is chosen

## 🛠️ Technical changes

- App data is now stored in an isolated folder, which opens the door to safe development sessions without risking data and simplifies the code responsible from backups.

# 0.1.0-alpha.2

## Features

- Export entire workspace as HTML
- Create backup of all settings and notes
- Restore from backups
- Added an even darker theme

## Improvements and fixes

- Tweaked default font settings to match different systems
  - Default UI font is now empty, meaning it will follow system by default
  - Other fonts now include fallbacks to system defaults
- Tweaked font settings to preview the font as you type
- Home and settings pages are now more responsive
- Tweaked dates in home page
- Fixed unreachable drag handle bug

## Technical changes

- Created an experimental build script (darkwrite-builder.js)
  - Automates the build process by checking for the operating system and handles rebuilds by removing old artifacts

# 0.1.0-alpha.1

Features (that work)

- Creating, editing, deleting and moving notes
- Adding notes to favorites
- Reordering all notes on the sidebar as well as your favorites
- Keeping notes in the trash before removing them permanently
- The editor, included blocks, and the formatting bubble
- Comes with 2 themes: Darkwrite's default theme and Catppuccin Mocha
- Pick your own accent color
- All fonts are customizable
- Search
- HTML import and export

Features that don't work

- You can't change background/text colors yet
- Any button/text box/switch that is disabled are features that are not implemented yet
