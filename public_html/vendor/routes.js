var routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    sprate:false
  },
  {
    sprate:true,
    title:"Menu Management"
  },
  {
    path: "/menu",
    name: "Category",
    icon: "ni ni-books",
    sprate:false
  },
  {
    sprate:true,
    title:"Order Management"
  },
  {
    path: "/order",
    name: "Listing",
    icon: "ni ni-box-2",
    sprate:false
  },
  {
    sprate:true,
    title:"Review Management"
  },
  {
    path: "/reviews",
    name: "Review",
    icon: "ni ni-air-baloon",
    sprate:false
  },
  {
    sprate:true,
    title:"User Help Request"
  },
  {
    path: "/helpReq",
    name: "Help Request",
    icon: "ni ni-air-baloon",
    sprate:false
  },
  {
    sprate:true,
    title:"POS Management"
  },
  {
    path: "/pos",
    name: "POS",
    icon: "ni ni-air-baloon",
    sprate:false
  },
  // {
  //   sprate:true,
  //   title:"POS Order List"
  // },
  // {
  //   path: "/posorder",
  //   name: "POS Orders",
  //   icon: "ni ni-air-baloon",
  //   sprate:false
  // },
  {
    sprate:true,
    title:"Discount Management"
  },
  {
    path: "/discount",
    name: "Discount",
    icon: "ni ni-scissors",
    sprate:false
  },
  {
    sprate:true,
    title:"Genral Setting"
  },
  {
    path: "/settig",
    name: "Setting",
    icon: "ni ni-scissors",
    sprate:false
  },
];
export default routes;
