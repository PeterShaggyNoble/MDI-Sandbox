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