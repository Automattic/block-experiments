/**
 * Internal dependencies
 */
import Tree from "./tree";

export default ({ attributes }) => {
  const { nodes, ordered } = attributes;
  const ListType = ordered ? "ol" : "ul";
  return <Tree nodes={nodes} ListType={ListType} />;
};
