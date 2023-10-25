import {
  CalendarIcon,
  BoxLineIcon,
  LeafIcon,
  LineIcon,
  DatabaseIcon,
} from "@/public/images/icon/icon";

const _nav = [
  {
    _tag: "SidebarNavTitle",
    name: "Menu",
  },

  {
    _tag: "SidebarNavItem",
    name: "Dashboard",
    to: "/",
    icon: <CalendarIcon size="18" />,
  },
  {
    _tag: "SidebarNavDropdown",
    name: "Pola Tanam",
    route: "/plant-pattern",
    icon: <CalendarIcon size="18" />,
    _children: [
      {
        _tag: "SidebarNavItem",
        name: "Pola Tanam Perencanaan",
        to: "/plant-pattern/planning",
      },
      {
        _tag: "SidebarNavItem",
        name: "Pola Tanam Pelaksanaan",
        to: "/plant-pattern/realisation",
      },
    ],
  },
  {
    _tag: "SidebarNavTitle",
    name: "Pengaturan",
  },
  {
    _tag: "SidebarNavItem",
    name: "Pasten",
    to: "/master-data/pastens",
    icon: <LeafIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Template Pola Tanam",
    to: "/master-data/plant-pattern-template",
    icon: <BoxLineIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Golongan",
    to: "/master-data/groups",
    icon: <DatabaseIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Area Lahan",
    to: "/master-data/areas",
    icon: <LineIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Saluran",
    to: "/master-data/lines",
    icon: <LineIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Titik Bangunan",
    to: "/master-data/nodes",
    icon: <LineIcon size="18" />,
  },
];

export { _nav };
