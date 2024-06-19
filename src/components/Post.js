import { useContext, useState } from "react";
import { SessionContext } from "../SessionProvider";

export function Post(props) {
  const { currentUser } = useContext(SessionContext);

  // console.log(props.post);
  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
      <p className="text-lg">
        @<span className="font-semibold">{props.post.user_name}</span>
      </p>
      <div className="textArea pt-2">
        <p className="text-gray-700 text-xl pb-2">{props.post.content}</p>
        <p>{new Date(props.post.created_at).toLocaleString()}</p>
      </div>

      {currentUser.id === props.post.user_id && (
        <div className="pt-2">
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

      {}
    </div>
  );
}
