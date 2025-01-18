import { defineStore } from "pinia";


export const useProgramsStore=defineStore("programs",{

state:()=>({
    programs:[],
}),
actions:{

    setprograms(prog)
    {
        this.programs=prog
    }
}


})
