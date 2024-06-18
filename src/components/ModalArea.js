import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { postRepository } from "../repositories/post";
import { supabase } from "../lib/supabase";
import { SessionContext } from "../SessionProvider";

export const ModalArea = (props) => {
  const { currentUser, setCurrentUser } = useContext(SessionContext);

  const [content, setContent] = useState("");
  const [id, setId] = useState();

  const updatePost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({
          content: content,
          created_at: new Date(),
        })
        .eq("id", id);

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
    props.setPosts([
      {
        ...props.post,
        id: id,
        content: content,
        user_id: currentUser.id,
        user_name: currentUser.userName,
        email: currentUser.email,
        created_at: new Date(),
      },
      ...props.posts,
    ]);
    setContent("");
  };

  const customStyles = {
    content: {
      top: "20%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      minWidth: "60%",
      padding: "30px",
    },
  };

  const closeModal = () => {
    props.setEditModalIsOpen(false);
  };

  async function updateFunc() {
    await updatePost();
  }

  const editContent = (e, id) => {
    setContent(e);
    setId(id);
    console.log(
      content,
      id,
      props.post.content,
      props.getSelectedContent.content
    );
  };

  if (!props.selectedContent) {
    return;
  }

  return (
    <>
      <Modal
        isOpen={props.editModalIsOpen}
        style={customStyles}
        onRequestClose={closeModal}
      >
        <h3 className="text-lg font-semibold border-b-2 pb-2 mb-4">編集画面</h3>
        <input
          type="text"
          className="w-full text-gray-700 text-xl"
          defaultValue={props.getSelectedContent.content}
          onChange={(e) =>
            editContent(e.target.value, props.getSelectedContent.id)
          }
        />

        <div className="pt-2 text-right">
          <button
            onClick={() => {
              updateFunc();
            }}
            className="text-blue-500 hover:underline cursor-pointer focus:outline-none"
          >
            保存
          </button>
        </div>
      </Modal>
    </>
  );
};
