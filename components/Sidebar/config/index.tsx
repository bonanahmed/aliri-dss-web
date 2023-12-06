import {
  LineIcon,
  HomeIcon,
  DashboardIcon,
  Database2Icon,
  SchemaIcon,
  AccountManagementIcon,
  PastenIcon,
  CheckBoardIcon,
  CheckMarkIcon,
  AreaIcon,
  Line2Icon,
  NodeIcon,
  ScadaIcon,
  CCTVIcon,
  CCTV2Icon,
} from "@/public/images/icon/icon";

const _nav = [
  {
    _tag: "SidebarNavItem",
    name: "Beranda",
    to: "/",
    icon: <HomeIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <DashboardIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Scada",
    to: "http://202.169.239.21/SCADA.BBWSSO/",
    icon: <ScadaIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "CCTV",
    to: "/cctv",
    icon: <CCTV2Icon size="18" />,
  },
  {
    _tag: "SidebarNavDropdown",
    name: "Pola Tanam",
    route: "/plant-pattern",
    icon: <Database2Icon size="18" />,
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
    _tag: "SidebarNavItem",
    name: "Skema",
    to: "/schema",
    icon: <SchemaIcon size="18" />,
  },

  {
    _tag: "SidebarNavItem",
    name: "Manajemen Akun",
    to: "/account-management",
    icon: <AccountManagementIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Pasten",
    to: "/master-data/pastens",
    icon: <PastenIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Template Pola Tanam",
    to: "/master-data/plant-pattern-template",
    icon: <CheckBoardIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Golongan",
    to: "/master-data/groups",
    icon: <CheckMarkIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Area Lahan",
    to: "/master-data/areas",
    icon: <AreaIcon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Saluran",
    to: "/master-data/lines",
    icon: <Line2Icon size="18" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Titik Bangunan",
    to: "/master-data/nodes",
    icon: <NodeIcon size="18" />,
  },
];

export { _nav };
