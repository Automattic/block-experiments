/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import metadata from "./block.json";
import edit from "./edit";
import save from "./save";
import { icon } from "./icons";

const { name, category, attributes } = metadata;

export const registerBlock = () =>
  registerBlockType(name, {
    title: __("Table of Contents"),
    icon,
    category,
    attributes,
    edit,
    save,
  });
