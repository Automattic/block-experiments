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
