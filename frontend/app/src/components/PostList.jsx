import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Post } from "./Post";
import { useQuery, gql } from "@apollo/client";

const GET_LOCATIONS = gql`
  query getPosts {
    posts {
      title
      order
    }
  }
`;

export const PostList = () => {
  const { loading, error, data } = useQuery(GET_LOCATIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  console.log(data.posts.length);
  return (
    <Stack gap={3}>
      {data.posts.map((post) => {
        return <Post post={post} key={post.title} />;
      })}
    </Stack>
  );
};
