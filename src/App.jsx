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
  // console.log("title : ", title, "views : ", views);

  //데이터 읽기========================
  const getPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      // console.log("get response : ", response);
      return response.data;
    } catch (error) {
      console.error("get error : ", error);
    }
  };

  const getProfile = async () => {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  };

  const getComments = async () => {
    const response = await axios.get(`${API_URL}/comments`);
    return response.data;
  };

  //데이터 추가하기====================
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

  //post query
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPost,
  });

  //profile query
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  // console.log("profile : ", profile);

  //comments query
  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
    enabled: false,
  });

  if (postsLoading || profileLoading) {
    ("로딩중입니다.");
    return;
  }

  if (postsError || profileError) {
    ("에러발생");
    return;
  }

  return (
    <>
      <div>{`profile : ${profile.name}`}</div>
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
      {posts.map((post) => {
        return (
          <div key={post.id}>
            {post.title}
            {post.views}
            <button>댓글보기</button>
          </div>
        );
      })}
    </>
  );
}

export default App;
