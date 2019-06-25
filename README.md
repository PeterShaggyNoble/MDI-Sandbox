# Material Design Icons Sandbox
## Important Notes
- This is a side-project to the main [Material Design Icons](https://materialdesignicons.com/) project. To request a new icon, suggest an alias or make a contribution to the icon pack, please [create an issue](https://github.com/Templarian/MaterialDesign/issues) in the main repository.
- One of the main purposes of this Sandbox is for me to play around with ECMAScript 6+ features I don't normally get to work with. As such I can only guarantee that the website will work in the latest version of Google Chrome.

## Features & Tools

### Icon Library

The main section of this project; a jacked up "cheatsheet" for MDI. Features include:
- Build your own library of icons.
- Upload custom icons to your library.
- Filter icons by keywords, categories and/or contributors.
- Download your library, filtered icons or individual icons in a variety of formats.
- Copy icon info such as SVG markup, path data and codepoints directly to your clipboard.
- Edit icons and download them in a variety of formats.
- See which icons were [added](https://petershaggynoble.github.io/MDI-Sandbox/?section=new), [updated](https://petershaggynoble.github.io/MDI-Sandbox/?section=updated), [renamed](https://petershaggynoble.github.io/MDI-Sandbox/?section=renamed) or [removed](https://petershaggynoble.github.io/MDI-Sandbox/?section=removed) in the latest release.
- See which icons will be [available in the next release](https://petershaggynoble.github.io/MDI-Sandbox/?section=soon).
- Access [icons which have since been removed](https://petershaggynoble.github.io/MDI-Sandbox/?section=retired) from the MDI library.
- Access a *small* selection of [icons which were rejected](https://petershaggynoble.github.io/MDI-Sandbox/?section=rejected) for inclusion in MDI.

> **Note:** Rejected icons are provided as-is, having not passed through the usual quality control measures before being added to the main MDI library.

### Preview Generator
![](https://petershaggynoble.github.io/MDI-Sandbox/img/readme/previews.png)

Create customised icon preview images which can be copied & pasted directly into GitHub issues (or anywhere else) at [petershaggynoble.github.io/MDI-Sandbox/preview/](https://petershaggynoble.github.io/MDI-Sandbox/preview/).

#### Automated Preview Generator
To save you some work, there's also an automated preview generator available at [mdi.houseofdesign.ie/tools/preview/](http://mdi.houseofdesign.ie/tools/preview/). Use the `icon` querystring parameter to provide an icon name from [the main library](https://petershaggynoble.github.io/MDI-Sandbox/), [Material Icons Extended](https://petershaggynoble.github.io/MDI-Sandbox/extended/), the [other Google icons](https://petershaggynoble.github.io/MDI-Sandbox/other/) or the [stock icons](https://petershaggynoble.github.io/MDI-Sandbox/stock/) and a preview will be generated that you can link to directly. You can also use the optional `action` parameter to provide the name of an icon from the main library to be shown in the bottom right corner.
> **Example:** [/?icon=vector-square&action=link](http://mdi.houseofdesign.ie/tools/preview/?icon=vector-square&action=link)

Alternatively, instead of using the `icon` parameter to provide the name of an existing icon, you can provide a custom path and name using the `path` & `name` parameters.
> **Example:** [/?name=vector-square&action=download&path=M2,2...Z](http://mdi.houseofdesign.ie/tools/preview/?name=vector-square&action=download&path=M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z)

If necessary, you can override the auto-detected preview type using the `type` parameter. The values this parameter can accept can be found in the table below along with their corresponding colours & labels.
> **Example:** [/?name=vector-square&action=download&type=final&path=M2,2...Z](http://mdi.houseofdesign.ie/tools/preview/?name=vector-square&action=download&type=final&path=M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z)

| Value       | Colour                                                           | Label            | Text                |
| ----------- | ---------------------------------------------------------------- | ---------------- | ------------------- |
| `standard`  | ![#616161](https://placehold.it/19/616161/000000?text=+) Grey    |                  |                     |
| `stock`     | ![#388e3c](https://placehold.it/19/388e3c/000000?text=+) Green   | Stock Icon       | Not yet available   |
| `wip`       | ![#1976d2](https://placehold.it/19/1976d2/000000?text=+) Blue    | Work in Progress | Unreleased Draft    |
| `final`     | ![#303f9f](https://placehold.it/19/303f9f/000000?text=+) Indigo  | Final Draft      | Not yet available   |
| `removed`   | ![#5d4037](https://placehold.it/19/5d4037/000000?text=+) Brown   | Legacy Icon      | No longer available |
| `rejected`  | ![#d32f2f](https://placehold.it/19/d32f2f/000000?text=+) Red     | Rejected         | Won't be added      |

### Additional Google Icons

A preview of the extra icons in Google's "Material Icons Extended" set is available at [petershaggynoble.github.io/MDI-Sandbox/extended/](https://petershaggynoble.github.io/MDI-Sandbox/extended/) and their GMP & AOG icons at [petershaggynoble.github.io/MDI-Sandbox/other/](https://petershaggynoble.github.io/MDI-Sandbox/other/). Icons can be downloaded but note that the `transform` attribute is used on the `path` elements to scale them down to 24 pixels.

### Issue Tracker
The [issue tracker](https://petershaggynoble.github.io/MDI-Sandbox/issues/) can be used to view the status of all [`Icon Request` issues](https://github.com/Templarian/MaterialDesign/issues?q=is%3Aissue+is%3Aopen+label%3A%22Icon+Request+%3Apencil2%3A%22), sorted by number of reactions with the ability to filter requests for stock Google icons, home automation icons or brand icons. Please note that the issue tracker can currently only be updated manually so you may not be seeing the most up-to-date data. I am working on a way to keep it updated automatically.

### Icon Editor
The [custom icon editor](https://petershaggynoble.github.io/MDI-Sandbox/editor/) expands on the editor included in the icon library to allow creation of PNGs using the path data from _any_ 24x24, 48x48 or 512x512 (vertically flipped) SVG. Also includes the ability to add `block-helper` or `color-helper` as an overlay.

### Standalone Version
A single-file, standalone version of the icon library can be downloaded from the menu on the site or found in the [`standalone` directory](https://github.com/PeterShaggyNoble/MDI-Sandbox/tree/master/standalone) in the repository. It can be run locally and offline but, unless you run the file through a web server, it can't access `window.localStorage` and, therefore, all functionality related to your icon library will be disabled.

New features will occasionally be available to preview & test at [petershaggynoble.github.io/MDI-Sandbox/src/](https://petershaggynoble.github.io/MDI-Sandbox/src/).

## Background
When [we](https://houseofdesign.ie/) began to drop Font Awesome from our projects in favour of the much more comprehensive [Material Design Icons](https://materialdesignicons.com/), so used were we to FA's website that we struggled at times to find the icons we needed on the MDI website or "[cheatsheet](https://cdn.materialdesignicons.com/3.7.95/)". So I threw together my own "cheatsheet" with the initial focus being on better categorising the icons and adding some keywords to help with searching (both of which proved to be sizable jobs!).

As it was something that only we were going to be using, I also used it as an opportunity to play around with a few things I didn't normally get to play with in my everyday work back then such as [Google's Material Design](https://material.io/guidelines/) and, more importantly, ECMAScript 6+. But then it grew, especially once [Templarian](https://github.com/Templarian) invited me to be a collaborator on the main MDI project, and I started thinking about more possibilities for use by a wider audience which led to the creation of more tools, some of them "proofs of concept" that would eventually be integrated into the [new MDI site](http://dev.materialdesignicons.com/) currently under development.