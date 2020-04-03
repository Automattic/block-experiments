/**
 * Internal dependencies
 */
import Tree from "./tree";

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from "@wordpress/data";

/**
 * External dependencies
 */
import { kebabCase } from "lodash";

const node = block => ({
  children: [],
  level: block.attributes.level,
  anchor: block.attributes.anchor,
  content: block.attributes.content
});

const nestTree = blocks => {
  const targetStack = [];
  const rootNode = node({ attributes: { level: 0 } });
  let prevNode = rootNode;
  let target = rootNode;
  for (let i = 0; i < blocks.length; i++) {
    const currentNode = node(blocks[i]);

    // if it has the same level, append it to target
    if (currentNode.level === prevNode.level) {
      target.children.push(currentNode);
    } else if (currentNode.level > prevNode.level) {
      // if it has a higher level, push target onto stack, set target to current children, append it to target
      targetStack.push(prevNode);
      target = prevNode;
      target.children.push(currentNode);
    } else if (currentNode.level < prevNode.level) {
      // if it has a lower level, set target to stack pop value, append it to target
      do {
        target = targetStack.pop(); // TODO wrap in while loop
      } while (target.level > currentNode.level);
      target.children.push(currentNode);
    }
    prevNode = currentNode;
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

export default ({ setAttributes }) => {
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
  setAttributes({ nodes });

  return <Tree nodes={nodes} />;
};
