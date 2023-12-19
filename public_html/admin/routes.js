var routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    sprate:false
  },
  {
    sprate:true,
    title:"Vendor Management"
  },
  {
    path:"/vendor",
    name: "Vendor",
    icon: "ni ni-shop",
    sprate:false
  },
  {
    sprate:true,
    title:"User Management"
  },
  {
    path:"/user",
    name: "User",
    icon: "ni ni-single-02",
    sprate:false
  },
  {
    sprate:true,
    title:"Driver Management"
  },
  {
    path:"/driver",
    name: "Driver",
    icon: "ni ni-delivery-fast",
    sprate:false
  },
  {
    sprate:true,
    title:"Order Management"
  },
  {
    path:"/order",
    name: "Listing",
    icon: "ni ni-box-2",
    sprate:false
  },
  {
    sprate:true,
    title:"Caregory Management"
  },
  {
    path:"/category",
    name: "Category",
    icon: "ni ni-books",
    sprate:false
  },
  {
    sprate:true,
    title:"Request's"
  },
  {
    path:"/request/contact",
    name: "Contact Us",
    icon: "ni ni-support-16",
    sprate:false
  },
  {
    path:"/request/career",
    name: "Career's",
    icon: "ni ni-support-16",
    sprate:false
  },
  {
    path:"/request/bocomestore",
    name: "Become a store",
    icon: "ni ni-support-16",
    sprate:false
  },
  {
    sprate:true,
    title:"Setting Manager"
  },
  {
    path:"/setting/main",
    name: "Main",
    icon: "ni ni-settings",
    sprate:false
  },
  {
    path:"/setting/order",
    name: "Order Assign",
    icon: "ni ni-settings-gear-65",
    sprate:false
  },
  {
    sprate:true,
    title:"CMS Manager"
  },
  {
    path:"/cms/",
    name: "Listing",
    icon: "ni ni-collection",
    sprate:false
  },
  
];
export default routes;
