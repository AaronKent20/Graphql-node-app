import { Stack } from "@mui/material";
import { useRef } from "react";
import { Post } from "./Post";
import { useQuery, gql } from "@apollo/client";
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

export const PostList = () => {
  const { loading, error, data } = useQuery(GET_LOCATIONS);

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
