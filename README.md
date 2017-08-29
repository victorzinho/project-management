# Project Management

## Issues

Manage issues with GitHub labels and [waffle](https://waffle.io).

To use it, define the GitHub/Waffle info as environment variables in the console:

```bash
export GITHUB_OWNER=victorzinho
export GITHUB_REPO=project-management
export GITHUB_TOKEN=<token>
export WAFFLE_TOKEN=<token>
```

> You can get your waffle token inspecting the HTTP requests in waffle.io with the Developer Tools of your browser.

Then write a JSON file with an object defining the labels (see an [example](https://github.com/victorzinho/project-management/blob/master/issues/labels.json)):

```json
{
  "<label_name>": "<color>"
}
```

> Labels starting with `Status: ` will be used as waffle columns.
> 
> Write colors without the leading `#`.

And then configure everything:

```bash
issues/configure.sh issues/labels.json
```


**Scripts**

* [issues/gh-delete-labels.js](https://github.com/victorzinho/project-management/blob/master/issues/gh-delete-labels.js): Deletes all labels from your repository.
* [issues/gh-create-labels.js](https://github.com/victorzinho/project-management/blob/master/issues/gh-create-labels.js): Creates labels according to the provided `labels.json` file.
* [issues/waffle-create.js](https://github.com/victorzinho/project-management/blob/master/issues/waffle-create.js): Creates the waffle project and cards.
* [issues/waffle-sort.js](https://github.com/victorzinho/project-management/blob/master/issues/waffle-sort.js): Sorts the cards in waffle according to a `sorting.json` file (see an [example](https://github.com/victorzinho/project-management/blob/master/issues/sorting.json)). This file must contain a JSON array with the labels ordered by priority; there a special `size` value that can be used to sort by size as well.
