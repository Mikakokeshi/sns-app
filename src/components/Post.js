import { useContext, useState } from "react";
import { SessionContext } from "../SessionProvider";
import { LikeButton } from "./LikeButton";

export function Post(props) {
  const { currentUser } = useContext(SessionContext);

  // const user_id_list = props.likes.map((like) => like.user_id);

  // console.log(user_id_list.includes(currentUser.id));

  // console.log(props.post);
  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
      <div className="textArea pt-2">
        <p className="text-gray-700 text-xl pb-2">{props.post.content}</p>
        <p className="text-xs">
          {new Date(props.post.created_at).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center lineHeight-1 pt-2 justify-between">
        {currentUser.id === props.post.user_id && (
          <div className="">
            <button
              onClick={() => props.onDelete(props.post.id)}
              className="text-blue-500 hover:underline cursor-pointer focus:outline-none pr-2"
            >
              Delete
            </button>
            <button
              onClick={() => {
                props.setEditModalIsOpen(true);
                props.setSelectedContent(props.post.id);
              }}
              className="text-blue-500 hover:underline cursor-pointer focus:outline-none"
            >
              Edit
            </button>
          </div>
        )}
        <LikeButton post={props.post} />
      </div>

      <p className="text-xs">
        @<span className="">{props.post.user_name}</span>
      </p>
    </div>
  );
}
