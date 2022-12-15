const state = {
    category: "",
};
const getters = {
    getCategory: (state) => state.category,
};
const actions = {};
const mutations = {
    setCategory: (state,category) => (state.category = category),
};
export default{
    state,
    getters,
    actions,
    mutations,
};