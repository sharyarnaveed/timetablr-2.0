import { defineStore } from "pinia";

export const useTimetableStore = defineStore("timetable", {
  state: () => ({
    classes: [],
    currentClass: null,
    notcurrentclass: [],
  }),
  actions: {
    setClasses(classes) {
      if (Array.isArray(classes)) {
        this.classes = classes;
        // console.log("Classes set successfully:", this.classes);
      } else {
        // console.error("setClasses expects an array but received:", classes);
      }
    },
    findCurrentClass() {
      const now = new Date();
      const currenthours = now.getHours();
      const currentminutes = now.getMinutes();
      const Totalmins = currenthours * 60 + currentminutes;

      // console.log("All classes:", this.classes);

      this.currentClass = this.classes.find((c) => {
        const [startHours, startMinutes] = c.start_time.split(":").map(Number);
        const [endHours, endMinutes] = c.end_time.split(":").map(Number);

        const classStart = startHours * 60 + startMinutes;
        const classEnd = endHours * 60 + endMinutes;

        // console.log(`Checking: Start=${classStart}, End=${classEnd}, Now=${Totalmins}`);
        return Totalmins >= classStart && Totalmins <= classEnd;
      });

      // console.log("Current class:", this.currentClass);
    },
    findnotcurrent() {
      const now = new Date();
      const currenthours = now.getHours();
      const currentminutes = now.getMinutes();
      const Totalmins = currenthours * 60 + currentminutes;

      // console.log("Finding not current classes. All classes:", this.classes);

      if (!Array.isArray(this.classes)) {
        console.error("this.classes is not an array:", this.classes);
        return;
      }

      this.notcurrentclass = this.classes.filter((c) => {
        const [startHours, startMinutes] = c.start_time.split(":").map(Number);
        const classStart = startHours * 60 + startMinutes;

        // console.log("Class start time in minutes:", classStart);
        return Totalmins < classStart; // Classes after current time
      });


      if(this.notcurrentclass.length===0)
      {
      const notlocalclass= this.getnotclocal();
        this.storednotclocal(notlocalclass)
      }
      else{

this.storednotclocal(this.notcurrentclass)
      }
     
    },
    storelocal() {
      try {
        localStorage.setItem('classes', JSON.stringify(this.classes));
      } catch (error) {
        console.error('Error storing classes in localStorage:', error);
      }
    },

    getlocal() {
      try {
        const stored = localStorage.getItem('classes');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Error retrieving classes from localStorage:', error);
        return [];
      }
    },

    storednotclocal(Notclass) {
      try {
        localStorage.setItem('notcurrent', JSON.stringify(Notclass));
      } catch (error) {
        console.error('Error storing notcurrent classes:', error);
      }
    },

    getnotclocal() {
      try {
        const stored = localStorage.getItem('notcurrent');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Error retrieving notcurrent classes:', error);
        return [];
      }
    },

    storedaywiseinlocal(timetable) {
      try {
        localStorage.setItem('daywise', JSON.stringify(timetable));
      } catch (error) {
        console.error('Error storing daywise timetable:', error);
      }
    },

    getdaywiseinlocal() {
      try {
        const stored = localStorage.getItem('daywise');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Error retrieving daywise timetable:', error);
     
      }
    }
  },
});
