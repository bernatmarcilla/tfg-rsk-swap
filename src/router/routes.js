import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/pages/Dashboard.vue");
const Icons = () => import(/* webpackChunkName: "common" */ "@/pages/Icons.vue");
const Pools = () => import(/* webpackChunkName: "common" */ "@/pages/Pools.vue");
const Typography = () => import(/* webpackChunkName: "common" */ "@/pages/Typography.vue");

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/swap",
    children: [
      {
        path: "swap",
        name: "swap",
        component: Dashboard
      },
      {
        path: "icons",
        name: "icons",
        component: Icons
      },
      {
        path: "pools",
        name: "pools",
        component: Pools
      },
      {
        path: "typography",
        name: "typography",
        component: Typography
      },

    ]
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
