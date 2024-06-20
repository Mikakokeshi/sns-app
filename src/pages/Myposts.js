import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { SessionContext } from "../SessionProvider";
import { SideMenu } from "../components/SideMenu";
import { postRepository } from "../repositories/post";
import { Post } from "../components/Post";
import { Pagination } from "../components/Pagination";
import { ModalArea } from "../components/ModalArea";
import { Header } from "../components/Header";

const limit = 5;

function Myposts() {
  const { currentUser, setCurrentUser } = useContext(SessionContext);

  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedContent, setSelectedContent] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (page) => {
    const posts = await postRepository.myposts(page, limit, currentUser.id);
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

  if (currentUser == null) return <Navigate replace to="/signin" />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto mt-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="">
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

export default Myposts;
