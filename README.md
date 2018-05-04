# Material Design Icons Sandbox
## Important Notes
- This is a side-project to the main [Material Design Icons](https://materialdesignicons.com/) project. To request a new icon, suggest an alias or make a contribution to the icon pack, please [create an issue](https://github.com/Templarian/MaterialDesign/issues) in the main repository.
- One of the main purposes of this Sandbox is for me to play wround with ECMAScript 6+ features I don't normally get to work with. As such I can only guarantee that the website will work in the latest version(s) of Google Chrome.

## Features & Tools

![](https://petershaggynoble.github.io/MDI-Sandbox/img/readme.png)
### Icon Library
The main section of this project; a jacked up "cheatsheet" for MDI. Features include:
- Build your own library by adding icons to your favourites.
- Add your own custom icons to your library.
- Filter icons by keywords, categories and/or contributors.
- Download your library, filtered icons or individual icons in a variety of formats.
- Copy icon info such as SVG markup, path data and codepoints directly to your clipboard.
- Edit icons and download them in a variety of formats.
- See which icons were [added](https://petershaggynoble.github.io/MDI-Sandbox/?section=new), [updated](https://petershaggynoble.github.io/MDI-Sandbox/?section=updated), [renamed](https://petershaggynoble.github.io/MDI-Sandbox/?section=renamed) or  [removed](https://petershaggynoble.github.io/MDI-Sandbox/?section=removed) in the latest release.
- See which icons will be [available in the next release](https://petershaggynoble.github.io/MDI-Sandbox/?section=soon).
- Access [icons which have since been removed](https://petershaggynoble.github.io/MDI-Sandbox/?section=retired) from the MDI library.

### Preview Generator
Create customised icon preview images which can be copied & pasted directly into GitHub issues (or anywhere else) at [petershaggynoble.github.io/MDI-Sandbox/preview/](https://petershaggynoble.github.io/MDI-Sandbox/preview/).

### Additional Google Icons
A preview of the extra icons in Google's "Material Icons Extended" set is available at [petershaggynoble.github.io/MDI-Sandbox/extended/](https://petershaggynoble.github.io/MDI-Sandbox/extended/) and their GMP & AOG icons at [petershaggynoble.github.io/MDI-Sandbox/other/](https://petershaggynoble.github.io/MDI-Sandbox/other/). Icons can be downloaded but note that the `transform` attribute is used on the `path` elements to scale them down to 24 pixels.

### Issue Tracker
The [issue tracker](https://petershaggynoble.github.io/MDI-Sandbox/issues/) can be used to view the status of all [`Icon Request` issues](https://github.com/Templarian/MaterialDesign/issues?q=is%3Aissue+is%3Aopen+label%3A%22Icon+Request+%3Apencil2%3A%22), sorted by number of reactions with the ability to filter request for stock Google icons, home automation icons or brand icons. Please note that the issue tracker can currently only be updated manually so you may not be seeing the most up-to-date data. I am working on a way to keep it updated automatically.

### Icon Editor
The [custom icon editor](https://petershaggynoble.github.io/MDI-Sandbox/editor/) expands on the editor included in the icon library to allow creation of PNGs using the path data from _any_ 24x24, 48x48 or 512x512 (vertically flipped) SVG. Also includes the ability to add `block-helper` or `color-helper` as an overlay.

### Standalone Version
A single-file, standalone version can be downloaded from the menu on the site or found in the [`standalone` directory](https://github.com/PeterShaggyNoble/MDI-Sandbox/tree/master/standalone) in the repository. It can be run locally and offline but, unless you run the file through a web server, it can't access `window.localStorage` and, therefore, all functionality related to favourites will be disabled.

## Coming Soon
Some upcoming features that are being planned or worked on include:
- a tool to automatically generate previews of icons included in the MDI library,
- a PHP library, which can be downloaded for testing through the Sandbox (see [this issue](https://github.com/Templarian/MaterialDesign/issues/3087) for more details),
- a JavaScript library, and,
- a tool to keep the issue tracker automatically updated.

New features will occasionally be available to preview & test at [petershaggynoble.github.io/MDI-Sandbox/src/](https://petershaggynoble.github.io/MDI-Sandbox/src/).

## Background
When [we](https://houseofdesign.ie/) began to drop Font Awesome from our projects in favour of the much more comprehensive [Material Design Icons](https://materialdesignicons.com/), so used were we to FA's website, we struggled at times to find the icons we needed on the MDI website or "[cheatsheet](https://cdn.materialdesignicons.com/2.3.54/)". So I threw together my own "cheatsheet" with the initial focus being on better categorising the icons and adding some keywords to help with searching (both of which proved to be sizable jobs!).

As it was something that only we were going to be using, I also used it as an opportunity to play around with a few things I didn't normally get to play with in my everyday work back then such as [Google's Material Design](https://material.io/guidelines/) and, more importantly, ECMAScript 6+. But then it grew, especially once [Templarian](https://github.com/Templarian) invited me to be a collaborator on the main MDI project, and I started thinking about more possibilities for use by a wider audience which led to the creation of more tools, some of them "proofs of concept" that would eventually be integrated into the new MDI site currently under development.