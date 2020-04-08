/**
 * WordPress dependencies
 */
import { BlockControls } from "@wordpress/block-editor";
import { ToolbarGroup } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { formatListBullets, formatListNumbered } from "@wordpress/icons";

/**
 * Internal dependencies
 */
import Tree from "./tree";

/**
 * External dependencies
 */
import { kebabCase, last } from "lodash";

const node = block => ({
  children: [],
  level: block.attributes.level,
  anchor: block.attributes.anchor,
  content: block.attributes.content
});

const parent = stack => last(stack);
const sibling = stack => last(parent(stack).children);

const nestTree = blocks => {
  const rootNode = node({ attributes: { level: 0 } });
  rootNode.children = [node(blocks[0])];
  const nodeStack = [rootNode];
  for (let i = 1; i < blocks.length; i++) {
    const currentNode = node(blocks[i]);
    let parentNode = parent(nodeStack);
    let siblingNode = sibling(nodeStack);

    if (currentNode.level === siblingNode.level) {
      parentNode.children.push(currentNode);
    } else if (siblingNode.level < currentNode.level) {
      nodeStack.push(siblingNode);
      siblingNode.children.push(currentNode);
    } else if (currentNode.level < siblingNode.level) {
      while (currentNode.level < siblingNode.level) {
        siblingNode = nodeStack.pop();
        parentNode = parent(nodeStack);
      }
      parentNode.children.push(currentNode);
    }
  }

  return rootNode.children;
};

const makeAnchor = (title, usedAnchors) => {
  const kebabTitle = kebabCase(title);
  let titleCandidate = kebabTitle,
    i = 0;
  while (usedAnchors.has(titleCandidate)) {
    titleCandidate = kebabTitle + "-" + i++;
  }
  return titleCandidate;
};

export default ({ attributes, setAttributes }) => {
  const { updateBlockAttributes } = useDispatch("core/editor");

  const { headings, anchors } = useSelect(select => {
    const headings = select("core/block-editor")
      .getBlocks()
      .filter(block => block.name === "core/heading");

    const anchors = select("core/block-editor")
      .getBlocks()
      // ignore uncommitted anchors so they continue to update
      .filter(block => block.attributes.anchor && !block.attributes.tempAnchor)
      .map(block => block.attributes.anchor);

    return { headings, anchors };
  });

  const usedAnchors = new Set(anchors);

  // We are storing a temp anchor name on anchors we've created so they get updated
  // as the content changes
  const unanchoredHeadings = headings.filter(
    block => block.attributes.tempAnchor || !block.attributes.anchor
  );

  unanchoredHeadings.forEach(block => {
    const newAnchor = makeAnchor(block.attributes.content, usedAnchors);
    updateBlockAttributes(block.clientId, {
      anchor: newAnchor,
      tempAnchor: newAnchor
    });
    usedAnchors.add(newAnchor);
  });

  const nodes = nestTree(headings);
  useEffect(() => {
    setAttributes({ nodes });
  }, [...headings]);

  const ListType = attributes.ordered ? "ol" : "ul";

  return (
    <>
      <BlockControls>
        <ToolbarGroup
          controls={[
            {
              icon: formatListBullets,
              title: __("Convert to unordered list"),
              isActive: ListType === "ul",
              onClick() {
                setAttributes({ ordered: false });
              }
            },
            {
              icon: formatListNumbered,
              title: __("Convert to ordered list"),
              isActive: ListType === "ol",
              onClick() {
                setAttributes({ ordered: true });
              }
            }
          ]}
        />
      </BlockControls>
      <Tree nodes={nodes} ListType={ListType} />
    </>
  );
};
