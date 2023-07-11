=== Layout Grid Block ===
Contributors: automattic, jasmussen, johnny5, mkaz
Stable tag: trunk
Tested up to: 6.2
Requires at least: 5.8
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Tags: blocks, layout, grid, design, block

A Gutenberg container block to let you align items consistently across a global grid.

== Description ==

Want to create a column-based layout with easily customizable column-width and positions? Or perhaps you want to align your content to a global layout grid across your post. With this Layout Grid block you can do both or either. There are also options to provide specific layouts to mobile or tablet breakpoints. Pick a number of columns (1-4), then go ahead and resize and position each column as you want them to look, for any screen. Optionally apply background colours and paddings to add emphasis.

## Source and Support

You can follow development, file an issue, suggest features, and view the source at the Github repo: <a href="https://github.com/automattic/block-experiments">https://github.com/automattic/block-experiments</a>

== Screenshots ==

1. Grid layout selector.
2. Three column grid with resize handles.

== Changelog ==

= 1.8.4 - 11th July 2023 =
* Fix error in editor with icons

= 1.8.3 - 16th May 2023 =
* Fix crash in site editor

= 1.8.2 - 16th June 2022 =
* Update device preview handling to be more consistent

= 1.8.1 - 18th March 2022 =
* Change layout grid to not be fullwide by default

= 1.8 - 25th January 2022 =
* General updates for recent Gutenbergs

= 1.7.2 - 19th November 2021 =
* Prefer site editor viewport settings when changing the preview device type

= 1.7.1 - 11th November 2021 =
* Show block in excerpts

= 1.7 - 19th July 2021 =
* Add initial support for WordPress mobile app
* Fix incorrect behaviour of drag handles in Safari
* Fix sticky block styles
* Fix image right alignment

= 1.6 - 26th March 2021 =
* Remove deprecated Gutenberg functions
* Restore hyphenation behaviour to 1.3 - it caused too many issues
* Remove Firefox fix in 1.2.4 which no longer seems to be needed and causes other issues
* Merge front.css into style.css
* Force grid preview to be desktop mode, to improve appearance in pattern inserter

= 1.5 - 8th February 2021 =
* Improve editor responsive behaviour on smaller devices
* Bump minimum WordPress version to 5.6

= 1.4 - 15th January 2021 =
* Use hyphenation for text inside a grid column
* Add missing `has-background` for columns with a custom background colour
* Fix CSS for use in full site editor

= 1.3 - 21st July 2020 =
* Add vertical alignment to grid and grid columns
* Mirror grid device breakpoint with editor preview breakpoint (requires WP 5.5 or Gutenberg plugin)
* Bump minimum WordPress version to 5.5

= 1.2.4 - 14th July 2020 =
* Fix some blocks breaking outside of the grid in Firefox
* Fix editor margins for some themes

= 1.2.3 - 29th June 2020 =
* Fix some styles not loading in the editor

= 1.2.2 - 23rd June 2020 =
* Fix the CSS loading fix from 1.2.1 so it uses wp_register_style

= 1.2.1 - 10th June 2020 =
* Fix block inserter to show inside a grid column
* Fix vertical margin in editor so it better matches the display
* Fix CSS loading so it is only added when block is used
* Fix grid lines appearing when inner block is selected

= 1.2 - 29th April 2020 =
* Move the selected breakpoint to the toolbar and allow it to be toggled
* Bump minimum WordPress version to 5.4
* Improve drag handle behaviour
* Fix multi-select inside grid blocks
* Fix output of grid front-end CSS
* Fix issue with sizing being off when full-wide
* Fix old classes being added when column layout changes

= 1.1 - 10th March 2020 =
* Add option to disable start and end gutters for full-bleed layout
* Add option to control gutter size
* Fix a Firefox 100% height bug when multiple blocks are inside one column
* Improve IE11 support

= 1.0.5 - 28th January 2020 =
* Fix editor layout issues with themes that don't support Gutenberg

= 1.0.4 - 21st January 2020 =
* Fix layout issues with Gutenberg 7.3

= 1.0.3 - 12th December 2019 =
* Fix grid values being ignored in the 7.1.0 editor
* Fix cropping of grid when inside a group block

= 1.0.2 - 28th November 2019 =
* Fix a bug with duplicate column spans

= 1.0.1 - 26th November 2019 =
* Fix problem with edit history putting the block into an inbetween state
* Fix cropping of the grid in the editor

= 1.0 - 7th November 2019 =
* Initial release
