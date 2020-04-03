const Tree = ({ nodes }) => {
  if (!nodes || !nodes.length) {
    return null;
  }

  return (
    <ul>
      {nodes.map(node => {
        const { children, anchor, content } = node;

        return (
          <li key={anchor}>
            <a href={"#" + anchor}>{content}</a>
            <Tree nodes={children} />
          </li>
        );
      })}
    </ul>
  );
};

export default Tree;
