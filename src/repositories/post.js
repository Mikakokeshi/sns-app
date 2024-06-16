import { supabase } from "../lib/supabase";

export const postRepository = {
    async create(content, userId, email,user_name) {
        const {data, error} = await supabase
        .from('posts')
        .insert([{content, user_id: userId, email: email, user_name: user_name}])
        .select();

        if(error != null) throw new Error(error.message);

        return data[0];
    },

    async find(page, limit, userName){
        page = isNaN(page) || page < 1 ? 1 : page;
        const start = limit * (page - 1);
        const end = start + (limit - 1);

        const {data ,error} = await supabase
        .from('posts')
        .select('*')
        .range(start, end)
        .order('created_at', {ascending: false});
        if(error!=null) throw new Error(error.message);

        return data.map((post) => {
            return {
                ...post,
                content: post.content,
                user_id : post.user_id,
                user_name : post.user_name,
                created_at : post.created_at,  
            };
        });
        
    },

    async delete(id) {
        const { error } = await supabase
        .from('posts')
        .delete().eq('id', id)
        if (error != null) throw new Error (error.message)
        window.location.reload();

        return true;
    },
    // async update(content, id) {
    //     const {data, error} = await supabase
    //     .from('posts')
    //     .update({ content: content })
    //     .eq('id', id);
    //     if (error) {
    //         throw new Error(error.message);
    //     } else if (data && data.length > 0) {
    //         // データが見つかった場合
    //         return data[0];
    //     } else {
    //         // データが見つからない場合の処理
    //         return null; // または適切な値を返す
    //     }
    // },
}