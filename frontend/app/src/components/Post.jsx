import { Card } from "@mui/material";

import { styled } from "@mui/material/styles";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const PostTitle = styled("div")(({ theme }) => ({
  ...theme.typography.h3,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  textAlign: "left",
}));

export const Post = ({ post }) => {
  const ref = useRef(null);

  const [{}, drag] = useDrag(
    () => ({
      type: "card",
      item: post.title,
      collect: (monitor) => ({}),
    }),
    []
  );

  const [{ opacity }, drop] = useDrop(
    () => ({
      accept: "card",
      drop: () => {},
      collect: (monitor) => ({
        opacity: monitor.isOver() ? 0.5 : 1,
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [post]
  );

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity }}>
      <Card variant="outlined">
        <PostTitle>{post.title}</PostTitle>
      </Card>
    </div>
  );
};
