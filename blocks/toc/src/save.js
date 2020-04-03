/**
 * Internal dependencies
 */
import Tree from "./tree";

export default ({ attributes }) => {
  const { nodes } = attributes;

  return <Tree nodes={nodes} />;
};
