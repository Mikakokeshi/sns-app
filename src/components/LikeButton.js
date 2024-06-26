import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { SessionContext } from "../SessionProvider";
import { HeartIcon } from "@heroicons/react/24/solid";

export const LikeButton = (props) => {
  const { currentUser } = useContext(SessionContext);

  const [loadingLike, setLoadingLike] = useState("");
  const [likes, setLikes] = useState([]);
  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    fetchLikes();
  }, []);

  // いいねボタンクリック
  const contentLike = async (contentId, handle) => {
    setLoadingLike(contentId);
    console.log(contentId, isLike, loadingLike.type);
    setIsLike(handle);

    if (handle) {
      // いいねを追加
      console.log("いいね");
      const { data, error } = await supabase
        .from("likes")
        .insert({
          user_id: currentUser.id,
          post_id: contentId,
        })
        .select();

      if (error != null) throw new Error(error.message);

    } else {
      // いいねを削除
      console.log("いいね削除");

      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ user_id: currentUser.id, post_id: contentId });

      if (error != null) throw new Error(error.message);
      //   window.location.reload();
    }
    setLoadingLike("");
  };
  // いいね投稿取得
  const fetchLikes = async () => {
    const { data, error } = await supabase.from("likes").select("*");
    setLikes(data);
    if (error != null) throw new Error(error.message);

    return data.map((like) => {
      return {
        ...like,
        user_id: like.user_id,
        post_id: like.post_id,
      };
    });
  };
  console.log(likes);
  // いいねされてる投稿をリスト化
  const post_id_list = likes.map((like) => like.post_id);
  const user_id_list = likes.map((like) => like.user_id);
  const found = post_id_list.find((post_id) => post_id === loadingLike);

  console.log(
    isLike,
    currentUser.id,
    props.post.user_id
  );

  if (loadingLike === props.post.id) {
    // ローディング
    return (
      <div className="h-4 w-4 animate-spin rounded-full border border-yellow-500 border-t-transparent" />
    );
  } else if (
    //isLikeがTrueの場合

    // ログインユーザーのID(currentUser.id)と投稿記事のユーザーID(props.post.user_id)が同じ場合 && データベースにログインユーザーIDが含まれている
    isLike !== false ||
    (currentUser.id === props.post.user_id &&
      post_id_list.includes(props.post.id))
  ) {
    // いいね済み
    console.log("いいね済み");

    return (
      <div
        className="text-pink-500 cursor-pointer"
        onClick={() => contentLike(props.post.id, false)}
      >
        <HeartIcon className="h-5 w-5" />
      </div>
    );
  }

  else {
    // いいね無し
    console.log("いいね無し");

    return (
      <div
        className="text-gray-400 cursor-pointer"
        onClick={() => contentLike(props.post.id, true)}
      >
        <HeartIcon className="h-5 w-5" />
      </div>
    );
  }
};
