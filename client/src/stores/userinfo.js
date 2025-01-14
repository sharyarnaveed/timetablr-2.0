import { defineStore } from "pinia";

export const useUserStore = defineStore("userdata", {
  state: () => ({
    username:"",

  }),
  actions: {
  
storeusername(data)
{
    try {
        localStorage.setItem('username', JSON.stringify(data));
      } catch (error) {
        console.error('Error storing classes in localStorage:', error);
      }
},
getusername()
{
    const stored = localStorage.getItem('username');
        return stored ? JSON.parse(stored):null
    

}


}
});