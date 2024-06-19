import { supabase } from "../lib/supabase";

export const postRepository = {
  async create(content, userId, email, user_name) {
    const { data, error } = await supabase
      .from("posts")
      .insert([
        { content, user_id: userId, email: email, user_name: user_name },
      ])
      .select();

    if (error != null) throw new Error(error.message);

    return data[0];
  },

  async find(page, limit) {
    page = isNaN(page) || page < 1 ? 1 : page;
    const start = limit * (page - 1);
    const end = start + (limit - 1);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .range(start, end)
      .order("created_at", { ascending: false });
    if (error != null) throw new Error(error.message);

    return data.map((post) => {
      return {
        ...post,
        content: post.content,
        user_id: post.user_id,
        user_name: post.user_name,
        created_at: post.created_at,
      };
    });
  },

  async myposts(page, limit, userId) {
    page = isNaN(page) || page < 1 ? 1 : page;
    const start = limit * (page - 1);
    const end = start + (limit - 1);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .range(start, end)
      .order("created_at", { ascending: false });
    if (error != null) throw new Error(error.message);

    return data.map((post) => {
      return {
        ...post,
        content: post.content,
        user_id: post.user_id,
        user_name: post.user_name,
        created_at: post.created_at,
      };
    });
  },

  async searchposts(content) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .textSearch("content", content);
    if (error != null) throw new Error(error.message);

    return data.map((post) => {
      return {
        ...post,
        content: post.content,
        user_id: post.user_id,
        user_name: post.user_name,
        created_at: post.created_at,
      };
    });
  },

  async delete(id) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error != null) throw new Error(error.message);
    window.location.reload();

    return true;
  },
};
