import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { SessionContext } from "../SessionProvider";
import { SideMenu } from "../components/SideMenu";
import { postRepository } from "../repositories/post";
import { Post } from "../components/Post";
import { Pagination } from "../components/Pagination";
import { ModalArea } from "../components/ModalArea";
import { Header } from "../components/Header";
import { supabase } from "../lib/supabase";

const limit = 5;

function Home() {
  const { currentUser, setCurrentUser } = useContext(SessionContext);

  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedContent, setSelectedContent] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    const post = await postRepository.create(
      content,
      currentUser.id,
      currentUser.email,
      currentUser.userName
    );

    setPosts([
      {
        ...post,
        user_id: currentUser.id,
        user_name: currentUser.userName,
        email: currentUser.email,
      },
      ...posts,
    ]);
    setContent("");
  };

  const fetchPosts = async (page) => {
    const posts = await postRepository.find(page, limit, currentUser.userName);
    setPosts(posts);
    console.log(posts);
  };

  const moveToNext = async () => {
    const nextPage = page + 1;
    await fetchPosts(nextPage);
    setPage(nextPage);
  };

  const moveToPrev = async () => {
    const prevPage = page - 1;
    await fetchPosts(prevPage);
    setPage(prevPage);
  };

  const deletePost = async (postId) => {
    await postRepository.delete(postId);
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const getSelectedContent = () => {
    return posts.find((post) => post.id === selectedContent);
  };

  // const uploadImage = async (e) => {
  //   let file = e.target.files[0];
  //   console.log(currentUser.id + "/" + file.name);

  //   const { data, error } = await supabase.storage
  //     .from("images")
  //     .upload(currentUser.id + "/" + file.name, file);
  //   if (data) {
  //     // getImages();
  //     console.log("success upload image");
  //   }
  //   // if (error != null) throw new Error(error.message);
  // };

  // async function getImages() {
  //   const { data, error } = await supabase.storage
  //     .from("iamges")
  //     .list(currentUser?.id + "/", {
  //       limit: 100,
  //       offset: 0,
  //       sortBy: { column: "name", order: "asc" },
  //     });
  // }

  if (currentUser == null) return <Navigate replace to="/signin" />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        setCurrentUser={setCurrentUser}
        setPosts={setPosts}
        fetchPosts={fetchPosts}
      />
      <div className="container mx-auto mt-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <label
                for="formFileMultiple"
                class="mb-2 inline-block text-neutral-500 dark:text-neutral-400"
              >
                Share your thoughts
              </label>
              <textarea
                className="w-full p-2 mb-4 border-2 border-gray-200 rounded-md"
                placeholder="What's on your mind?"
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
              <from className="mb-3">
                {/* <label
                  for="formFileMultiple"
                  class="mb-2 inline-block text-neutral-500 dark:text-neutral-400"
                >
                  Upload your image
                </label>
                <input
                  class="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white"
                  type="file"
                  id="formFileMultiple"
                  onChange={(e) => {
                    uploadImage(e);
                  }}
                /> */}

                <button
                  onClick={createPost}
                  disabled={content === ""}
                  className="mt-4 bg-[#444] text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </from>
            </div>
            <div className="mt-4">
              {posts.map((post) => (
                <div key={post.id}>
                  <Post
                    post={post}
                    onDelete={deletePost}
                    setSelectedContent={setSelectedContent}
                    setEditModalIsOpen={setEditModalIsOpen}
                  />

                  <ModalArea
                    posts={posts}
                    post={post}
                    setPosts={setPosts}
                    setEditModalIsOpen={setEditModalIsOpen}
                    editModalIsOpen={editModalIsOpen}
                    selectedContent={selectedContent}
                    getSelectedContent={getSelectedContent()}
                  />
                </div>
              ))}
            </div>

            <Pagination
              onPrev={page > 1 ? moveToPrev : null}
              onNext={posts.length >= limit ? moveToNext : null}
            />
          </div>
          <SideMenu />
        </div>
      </div>
    </div>
  );
}

export default Home;
