import { defineStore } from "pinia";

export const useGraphStore = defineStore("graph", {

state:()=>({
    classstats:0,
    progres:0
}),

actions:{
     calculation()
    {
        const stored = localStorage.getItem('notcurrent');
       const size=JSON.parse(stored)
       const RemainingSize = size.length

      const AllClasses= localStorage.getItem("classes")
      const classes = JSON.parse(AllClasses)
       const TotalSize=classes.length
       
       if(TotalSize==0)
       {
this.progres=0;
return this.progres
       }
       

       const CompletedCount=TotalSize-RemainingSize;
       const completionPercentage = (CompletedCount / TotalSize) * 100;

       this.progres= Math.round(completionPercentage * 100) / 100
       return this.progres
    }
}
})