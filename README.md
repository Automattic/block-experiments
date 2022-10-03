# Block Experiments

A monorepo of block experiments by the fine folks at Automattic.

### About

This repository holds a collection of blocks allowing a single place to develop, test, and package. Plus it allows a single place for user's to submit issues.

To make development easier, the build script allows for building and bundling all of the blocks together.

For packaging, each block can be generated as its own stand-alone plugin.


## Development

1. Install node packages: `yarn install`

2. Run the development build with: `yarn start`
   (or)
   Run a production build with: `yarn build`

3. Once built, add copy this directory (or add a symlink) to your plugins directory.

4. Activate Block Experiments plugin, use blocks in Editor.

### Development WordPress environment

By running the following, a docker container is launched.

```sh
$ npm i -g @wordpress/env
$ yarn env start

WordPress development site started at http://localhost:8888/
WordPress test site started at http://localhost:8889/
MySQL is listening on port 59156
```

The development site will run at localhost and include a plugin loading all blocks.

See wp-env's [Quick (tl;dr) instructions](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/#quick-tldr-instructions) for credentials.

## Adding a block

Add a directory to `blocks`, ensure your block has:

- `your-block/index.php` - the block plugin file to register your block
- `your-block/src/index.js` - the JS init file
- `your-block/editor.scss` - the editor SCSS file
- `your-block/style.scss` - the editor/front SCSS file

When registering your block, use these values so it works when used inside of the bundle:

```php
register_block_type( 'jetpack/your-block-name', [
	'editor_script' => 'block-experiments',
	'style' => 'block-experiments',
	'editor_style' => 'block-experiments-editor',
] );
```

## Packaging a Plugin

The plugin bundler takes a set of blocks and builds a WordPress plugin, suitable for inclusion on a standalone site or WordPress.com.

The bundler uses a JSON file to list the blocks to bundle. These JSON files are stored in `bundler/bundles` and look like:

```json
{
	"blocks": [
		"block name"
	],
	"labs": true,
	"version": 0.1
}
```

The block names are listed under `blocks`, and the plugin version under `version`. If the bundle includes Tinker Labs blocks then set the `labs` to `true` so that the appropriate categories are also included.

Some blocks may require additional files, such as front end JS or CSS. These can be specified in manifest files, located in the block directory under `index.json`:

```json
[
	"extra.js",
	"extra.css"
]
```

1. Set the plugin bundle to build: `yarn plugin [bundle-name]`

2. Build the plugin: `yarn bundle`

The plugin zip file can be found at: `bundles/bundle-name.zip`

## Testing

You can test the Layout Grid with:

- `yarn layout`
- `yarn jest`

You can update the visual snapshots with:

- `yarn jest -u`

## Releasing an individual block plugin

If you want to release an individual block then you can follow these steps:

- Update the block `readme.txt` file. For example [bundler/resources/jetpack-layout-grid/readme.txt](bundler/resources/jetpack-layout-grid/readme.txt). Usually this involves adding an entry to the `Changelog` section (with date), and updating `Tested upto` as appropriate.
- Update the version number in the block JSON file. For example [bundler/bundles/layout-grid.json](bundler/bundles/layout-grid.json).
- Run `yarn plugin [bundle-name]`. For example `yarn plugin layout-grid`.
- Run `yarn bundle` to produce the plugin zip file at `bundles/bundle-name.zip`

For the [Layout Grid](https://wordpress.org/plugins/layout-grid/) the plugin files can then be updated in the SVN repository:

https://plugins.svn.wordpress.org/layout-grid/

On WordPress.com the files need updating under `gutenberg-blocks`. Both locations need to be updated.

### SVN Process

First check out the repo

```sh
mkdir dist/svn
cd dist/svn
svn co https://plugins.svn.wordpress.org/sketch --username oskosk
```

* Make sure you bump versions in `readme.txt`, and `.json` file . See [#291](https://github.com/Automattic/block-experiments/pull/291) for an example of versions bump.

Build the plugin bundle and copy it over the SVN working copy excluding the `assets` directory.
```sh
cd ../.. # back to root of block-experimentes repo
yarn plugin sketch
yarn bundle
rsync -a plugin/a8c-sketch/ dist/svn/sketch/trunk --exclude=assets
```

Prepare to release
```sh
cd dist/svn/sketch
svn cp trunk tags/1.1.0
svn ci -m 'Release version 1.1.0'
```

