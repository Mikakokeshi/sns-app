import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { SessionContext } from '../SessionProvider'
import { SideMenu } from '../components/SideMenu';
import { postRepository } from '../repositories/post';
import { Post } from '../components/Post';
import { Pagination } from '../components/Pagination';
import { authRepository } from '../repositories/auth';
import { ModalArea } from '../components/ModalArea';
import { supabase } from "../lib/supabase";

const limit = 5;

function Home() {
  
    const {currentUser, setCurrentUser} = useContext(SessionContext);

    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [email, setEmail] = useState("");
    const [selectedContent, setSelectedContent] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);


    useEffect(()=>{
      // window.location.reload();
      fetchPosts();

    },[])


    const createPost = async () => {

      const post = await postRepository.create(content, currentUser.id, currentUser.email, currentUser.userName)
      
      setPosts([{...post, user_id: currentUser.id, user_name: currentUser.userName, email:currentUser.email  }, ...posts]);
      setContent('');
    }

    const fetchPosts = async (page) => {
      const posts = await postRepository.find(page, limit, currentUser.userName);
        setPosts(posts);

        console.log(posts)
    }

    // const fetchPosts = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from("posts_view")
    //       .select("*")
    //       .limit(10)
    //     if (error) throw error;
        
    //     if (data != null) {
    //       setPosts(data); // [product1,product2,product3]
    //       return data.map((post) => {
    //         return {
    //             ...post,
    //             userId : post.user_id,
    //             userName : post.user_metadata.name,
    //         };
    //     });
    //     }
    //   } catch (error) {
    //     alert(error.message);
    //   }

    // }

    const moveToNext = async()=> {
      const nextPage = page + 1;
      await fetchPosts(nextPage);
      setPage(nextPage);
    }

    const moveToPrev = async()=> {
      const prevPage = page - 1;
      await fetchPosts(prevPage);
      setPage(prevPage);
    }
  
    const deletePost = async(postId) => {
      await postRepository.delete(postId);
      setPosts(posts.filter((post) => post.id !== postId))
    }


    const getSelectedContent = () => {
      return posts.find((post) => post.id === selectedContent);
    }
  

    const signout = async() => {
      await authRepository.signout();
      setCurrentUser(null);
    }

    if(currentUser == null ) return <Navigate replace to ="/signin"/>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#444] p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">SNS APP</h1>
          <button className="text-white hover:text-red-600" onClick={signout}>ログアウト</button>
        </div>
      </header>
      <div className="container mx-auto mt-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea
                className="w-full p-2 mb-4 border-2 border-gray-200 rounded-md"
                placeholder="What's on your mind?"
                onChange={(e)=> setContent(e.target.value)}
                value={content}
              />
              <button 
              onClick={createPost}
              disabled={content === '' }
              className="bg-[#444] text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Post
              </button>
            </div>
            <div className="mt-4">
              {posts.map((post) => 
                (
                  <div key={post.id} >
                <Post 
                  post={post} 
                  onDelete={deletePost} 
                  selectedContent={selectedContent} 
                  setSelectedContent={setSelectedContent} 
                  setEditModalIsOpen={setEditModalIsOpen}
                  setEmail={setEmail}
                  />
                  
                  <ModalArea 
                  posts={posts}
                    post={post} 
                    setPosts={setPosts}
                    setEditModalIsOpen={setEditModalIsOpen}
                    editModalIsOpen={editModalIsOpen}
                    selectedContent={selectedContent} 
                    // setSelectedContent={setSelectedContent} 
                    getSelectedContent={getSelectedContent()} 
                    // updatePost={updatePost}
                    // updatedContent={updatedContent}
                    setContent={setContent}
                    content={content}
                  />
                  </div>

                  ))}
            </div>

            <Pagination onPrev={ page > 1 ? moveToPrev: null} onNext={posts.length >= limit ? moveToNext : null} />
          </div>
        <SideMenu />
        </div>
      </div>
    </div>
  );
}

export default Home;


