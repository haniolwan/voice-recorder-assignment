type SidebarItem = {
  id: string;
  path: string;
  label: string;
};
export const getSidebarItems: SidebarItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
  },
  {
    id: "recordings",
    label: "Recordings",
    path: "/recordings",
  },
];
