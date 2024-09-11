import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const API_URL = "http://localhost:3000";

  const quertyClient = useQueryClient();

  // const [post, setPost] = useState({
  //   title: "",
  //   views: 0,
  // });

  const [title, setTitle] = useState("");
  const [views, setViews] = useState(0);
  console.log("title : ", title, "views : ", views);

  //데이터 읽기
  const getPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      console.log("get response : ", response);
      return response.data;
    } catch (error) {
      console.error("get error : ", error);
    }
  };

  //데이터 추가하기
  const addPost = async (newPost) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, newPost);
      console.log("post response", response);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const mutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      return quertyClient.invalidateQueries("posts");
    },
  });

  console.log("mutation : ", mutation);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: getPost,
  });

  if (isLoading) {
    ("로딩중입니다.");
    return;
  }

  if (isError) {
    ("에러발생");
    return;
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate({
            title,
            views,
          });
        }}
      >
        {/* <input type="text" name="title" placeholder="title" value={post.title} onChange={()=>{
          setPost({...post, post.title})
        }}/>
        <input type="number" name="views" placeholder="views" value={post.views} /> */}
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          type="number"
          value={views}
          onChange={(e) => {
            setViews(Number(e.target.value));
          }}
        />
        <button>추가하기</button>
      </form>
      {data.map((post) => {
        return (
          <div key={post.id}>
            {post.title}
            {post.views}
          </div>
        );
      })}
    </>
  );
}

export default App;
