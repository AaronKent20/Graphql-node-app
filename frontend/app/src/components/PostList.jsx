import { Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import { Post } from "./Post";
import { useQuery, gql, useSubscription } from "@apollo/client";
import { useDndScrolling } from "react-dnd-scrolling";

const GET_LOCATIONS = gql`
  query getPosts {
    posts {
      id
      title
      order
    }
  }
`;

const ORDER_CHANGED = gql`
  subscription orderChanged {
    orderChanged
  }
`;

export const PostList = () => {
  const { loading, error, data, refetch } = useQuery(GET_LOCATIONS);

  const subObject = useSubscription(ORDER_CHANGED);
  useEffect(() => {
    refetch();
  }, [subObject, refetch]);

  const ref = useRef();
  useDndScrolling(ref, { strengthMultiplier: 10 });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  console.log(data.posts.length);
  return (
    <Stack gap={3} ref={ref}>
      {data.posts.map((post) => {
        return <Post post={post} key={post.title} />;
      })}
    </Stack>
  );
};