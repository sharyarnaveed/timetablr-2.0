import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Signup from "@/views/signup.vue"
import Signin from "@/views/signin.vue"
// import Panehome from '@/views/panehome.vue'
import relatedtocourses from '@/views/relatedtocourses.vue'
import adminsignin from "@/views/admin/signin.vue"
import admindashboard from "@/views/admin/dashboard.vue"
import addcategory from "@/views/admin/addcategory.vue"
import addtimetable from "@/views/admin/addtimetable.vue"
import Daywise from "@/views/Daywise.vue"
import adminhome from "@/views/admin/adminhome.vue"
import Settings from '@/views/settings.vue'
import Viewtimetable from '@/views/admin/viewtimetable.vue'
import Seeusers from '@/views/admin/SeeUsers.vue'
import edittimetable from '@/views/admin/edittimetable.vue'
import AddPreviousCourse from '@/views/addPreviousCourse.vue'
import Viewcourses from '@/views/viewcourses.vue'
import Viewuserrepeatcourses from '@/views/admin/viewuserrepeatcourses.vue'
import Combinehomepanel from '@/views/combinehomepanel.vue'
import OtherTime from '@/views/OtherTime.vue'
import ABoutus from '@/views/ABoutus.vue'
import Notification from '@/views/admin/notification.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
  {
    path:"/signup",
    name:"signup",
    component:Signup
  },
  {
    path:"/signin",
    name:"signin",
    component:Signin
  },
  {
    path:"/home",
    name:"panelhome",
    component:Combinehomepanel
  },
  {
    path:"/about",
    component:ABoutus
  },
  {
path:"/other/:programid",
props:true,
component:OtherTime
  },
  {
    path:"/adminthesignin",
    name:"adminsignin",
    component:adminsignin
  },
  {
    path:"/settings",
    name:"settings",
    component:Settings
  },
  {
    path:"/daywise",
    name:"daywise",
    component:Daywise
  },
  {
path:"/viewcourse",
name:"viewcourse",
component:Viewcourses
  },
  {
    path:"/addrepatingcourse",
    name:"addrepatingcourse",
    component:AddPreviousCourse
  },
  {
    path:"/courses",
    name:"courses",
    component:relatedtocourses
  }
,{
  path:"/totheadmindashboard",
  name:"admindashboard",
  component:admindashboard,
  children:[

 {
path:"",
component:adminhome
 },
{
  path:"viewuserrepeat",
  component:Viewuserrepeatcourses
},
    {
      path:"addcategory",
      component:addcategory
    },
    {
      path:"uploadtimetable",
      component:addtimetable
    },
    {
      path:"viewtimetable",
      component:Viewtimetable
    },
      {
      path:"notification",
      component:Notification
    },
{
  path:"seeusers",
  component:Seeusers
},
{
  path:"edittimetable/:id",
  props:true,
  name:"edittimetable",
component:edittimetable
}
    
  
  ]
}



  ]
})

export default router
