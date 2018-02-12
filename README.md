# Material Design Icons Cheatsheet
**[View the icons](https://petershaggynoble.github.io/MDI-Sandbox/)**
## Read First
1. **Important Note:** This is a side-project to the main [Material Design Icons](https://materialdesignicons.com/) project. To request a new icon, suggest an alias or make a contribution to the icon pack, please [create an issue](https://github.com/Templarian/MaterialDesign/issues) in the main repository.
2. This repository is currently a work in progress, being my first project on GitHub. As such, please refrain from submitting any pull requests for now. If you have a request or suggestion then please [submit an issue](https://github.com/PeterShaggyNoble/MDI-Sandbox/issues) instead.

## Additional Tools
### Standalone Version
A single-file, standalone version can be downloaded from the menu on the site or found in the [`standalone` directory](https://github.com/PeterShaggyNoble/MDI-Sandbox/tree/master/standalone) in the repository. It can be run locally but, unless you run the file through a web server, it can't access `window.localStorage` and, therefore, all functionality related to favourites is disabled.

### Material Icons Extended
A preview of the extra icons in Google's "Material Icons Extended" set is available at [petershaggynoble.github.io/MDI-Sandbox/extended/](https://petershaggynoble.github.io/MDI-Sandbox/extended/). Icons can be downloaded but note that the `transform` attribute is used on the `path` elements to scale them down from 512 pixels.

### Preview Generator
Create customised icon preview images which can be copied & pasted directly into GitHub issues (or anywhere else) at [petershaggynoble.github.io/MDI-Sandbox/preview/](https://petershaggynoble.github.io/MDI-Sandbox/preview/).

### Icon Editor
The [custom icon editor](https://petershaggynoble.github.io/MDI-Sandbox/editor/) expands on the editor included on the site to allow creation of PNGs using the path data from _any_ 24x24, 48x48 or 512x512 (vertically flipped) SVG. Also includes the ability to add `block-helper` or `color-helper` as an overlay.

## How to Contribute
> Coming soon ...

## Background
A while back we began to drop Font Awesome from our projects in favour of the much more comprehensive [Material Design Icons](https://materialdesignicons.com/) but, so used were we to FA's website, we struggled at times to find the icons we needed on the MDI website or "cheatsheet". So I threw together my own "cheatsheet" with the initial focus being on better categorising the icons and adding some keywords to help with searching (both of which proved to be sizable jobs!). As it was something that only we were going to be using, I also used it as an opportunity to play around with a few things I didn't normally get to play with in my everyday work back then such as [Google's Material Design](https://material.io/guidelines/) and, more importantly, ECMAScript 6. But then it grew, especially once [Templarian](https://github.com/Templarian) invited me to be a collaborator on the main MDI project, and I started thinking about more possibilities for use by a wider audience. I recently decided to make this a community project to allow others to help with keeping it updated and with the categorisation of icons so took it as an opportunity to start properly familiarising myself with GitHub, and here we are!

## Change Log
Only major changes and additions will be noted here.
- **2018-02-12:** Added overlays to the [preview generator](https://petershaggynoble.github.io/MDI-Sandbox/preview/).
- **2018-01-30:** New [programming](https://petershaggynoble.github.io/MDI-Sandbox/?categories=programming) category added.
- **2017-12-11:** Material Design Icons v2.1.19 released.
- **2017-11-29:** Added helper icons to the [custom icon editor](https://petershaggynoble.github.io/MDI-Sandbox/editor/).
- **2017-11-28:** Two new sections show which icons have been [renamed](https://petershaggynoble.github.io/MDI-Sandbox/?section=renamed) in or [removed](https://petershaggynoble.github.io/MDI-Sandbox/?section=removed) from the latest release.
- **2017-11-22:** Added a [custom icon editor](https://petershaggynoble.github.io/MDI-Sandbox/editor/).
- **2017-11-22:** Added a [tool for generating GitHub previews](https://petershaggynoble.github.io/MDI-Sandbox/preview/).
- **2017-11-20:** New [music](https://petershaggynoble.github.io/MDI-Sandbox/?categories=music) category added.
- **2017-11-17:** New [games](https://petershaggynoble.github.io/MDI-Sandbox/?categories=games) category added.
- **2017-11-16:** Created a web app for Chrome mobile.
- **2017-11-14:** Created a [preview file](https://petershaggynoble.github.io/MDI-Sandbox/extended/) for the new icons in Google's Material Icons Extended set.
- **2017-11-10:** Added a counter for filtered icons.
- **2017-11-09:** Added an options menu to allow downloading of currently filtered icons.
- **2017-11-09:** Community icons can now be highlighted via the main menu.
- **2017-11-07:** Added vector downloads to the icon editor.
- **2017-11-06:** Added the ability to export, import and reset icon editor settings.
- **2017-11-05:** Added the ability to download favourites as an HTML file for use with Polymer.
- **2017-11-03:** Added the ability to download favourites as an SVG file for use with Angular.
- **2017-11-02:** Overhauled the design.
- **2017-10-27:** Added PNG downloads with basic editor.
- **2017-10-25:** Switched from flex layout to grid layout for icons.
- **2017-10-19:** Added [standalone version](https://petershaggynoble.github.io/MDI-Sandbox/standalone/) which can be downloaded for local use.
- **2017-10-16:** Added filters for contributors.
- **2017-10-13:** Categories now serve as filters, rather than each having its own individual section.
- **2017-10-12:** Added the ability to copy the SVG path of an icon.
- **2017-10-11:** Added a section for ["retired" icons](https://petershaggynoble.github.io/MDI-Sandbox/?section=retired), for the benefit of those who still have use for them.
- **2017-10-10:** Extracted all data to JSON files.
- **2017-10-10:** GitHub project launched.
