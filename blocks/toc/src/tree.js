const Tree = ({ nodes, ListType }) => {
  if (!nodes || !nodes.length) {
    return null;
  }

  return (
    <ListType>
      {nodes.map(node => {
        const { children, anchor, content } = node;

        return (
          <li key={anchor}>
            <a href={"#" + anchor}>{content}</a>
            <Tree nodes={children} ListType={ListType} />
          </li>
        );
      })}
    </ListType>
  );
};

export default Tree;
