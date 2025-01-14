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
      }
    },

    findCurrentClass() {
      const now = new Date();
      const currenthours = now.getHours();
      const currentminutes = now.getMinutes();
      const Totalmins = currenthours * 60 + currentminutes;

      this.currentClass = this.classes.find((c) => {
        const [startHours, startMinutes] = c.start_time.split(":").map(Number);
        const [endHours, endMinutes] = c.end_time.split(":").map(Number);
        const classStart = startHours * 60 + startMinutes;
        const classEnd = endHours * 60 + endMinutes;
        return Totalmins >= classStart && Totalmins <= classEnd;
      });
    },

    findnotcurrent() {
      const now = new Date();
      const currenthours = now.getHours();
      const currentminutes = now.getMinutes();
      const Totalmins = currenthours * 60 + currentminutes;

      if (!Array.isArray(this.classes)) {
        console.error("this.classes is not an array:", this.classes);
        return;
      }

      this.notcurrentclass = this.classes
        .filter((c) => {
          const [startHours, startMinutes] = c.start_time.split(":").map(Number);
          const classStart = startHours * 60 + startMinutes;
          return Totalmins < classStart;
        })
        .sort((a, b) => {
          const [aHours, aMinutes] = a.start_time.split(":").map(Number);
          const [bHours, bMinutes] = b.start_time.split(":").map(Number);
          return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
        });

      // Store in localStorage after filtering and sorting
      this.storednotclocal(this.notcurrentclass);
    },

    storelocal(data) {
      try {
        localStorage.setItem('classes', JSON.stringify(data));
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
        return [];
      }
    }
  },
});