import { Card } from "@mui/material";

import { styled } from "@mui/material/styles";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { gql, useMutation } from "@apollo/client";

const PostTitle = styled("div")(({ theme }) => ({
  ...theme.typography.h3,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  textAlign: "left",
}));

// Define mutation
const REORDER_POST = gql`
  mutation UpdatePostOrder($id: Int!, $order: Int!) {
    UpdatePostOrder(id: $id, order: $order) {
      id
      order
    }
  }
`;

export const Post = ({ post }) => {
  const ref = useRef(null);

  const [reorderPost, { data, loading, error }] = useMutation(REORDER_POST);

  const [, drag] = useDrag(
    () => ({
      type: "card",
      item: post,
      collect: (monitor) => ({}),
    }),
    []
  );

  const [{ opacity }, drop] = useDrop(
    () => ({
      accept: "card",
      drop: (item, monitor) => {
        reorderPost({ variables: { id: item.id, order: post.order } });
      },
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
