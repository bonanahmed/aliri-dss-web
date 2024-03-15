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
  PapanDigitalIcon,
  SettingIcon,
} from "@/public/images/icon/icon";

let userData: any;
if (typeof window !== "undefined") {
  userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") ?? "")
    : null;
  // Rest of your code here...
}
const _nav = [
  {
    _tag: "SidebarNavItem",
    name: "Beranda",
    to: "/",
    icon: <HomeIcon size="24" />,
  },
  {
    _tag: "SidebarNavDropdown",
    name: "Pola Tanam",
    route: "/plant-pattern",
    icon: <Database2Icon size="24" />,
    _children: [
      {
        _tag: "SidebarNavItem",
        name: "SK Bupati",
        to: "/plant-pattern/planning",
      },
      {
        _tag: "SidebarNavItem",
        name: "Realisasi Tata Tanam",
        to: "/plant-pattern/realisation",
      },
    ],
  },
  // {
  //   _tag: "SidebarNavItem",
  //   name: "Dashboard",
  //   to: "/dashboard",
  //   icon: <DashboardIcon size="24" />,
  // },
  {
    _tag: "SidebarNavItem",
    name: "Papan Eksploitasi Digital",
    to: "/papan-eksploitasi",
    icon: <PapanDigitalIcon size="24" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "Scada",
    to: "http://202.169.239.21/SCADA.BBWSSO/",
    icon: <ScadaIcon size="24" />,
  },
  {
    _tag: "SidebarNavItem",
    name: "CCTV",
    to: "/cctv",
    icon: <CCTV2Icon size="24" />,
  },
  {
    _tag: "SidebarNavDropdown",
    name: "Informasi Daerah Irigasi",
    route: "/information",
    icon: <AccountManagementIcon size="24" />,
    _children: [
      {
        _tag: "SidebarNavItem",
        name: "Skema Peta Jaringan",
        to: "/information/schema",
      },
      {
        _tag: "SidebarNavItem",
        name: "Dokumen",
        to: "/information/document",
      },
    ],
  },
  {
    _tag: "SidebarNavItem",
    name: "Data Akun",
    to: "/account-management",
    icon: <AccountManagementIcon size="24" />,
  },
];

if (userData && (userData?.role === "superadmin" || userData?.role === "admin"))
  _nav.push(
    // {
    //   _tag: "SidebarNavItem",
    //   name: "Skema",
    //   to: "/schema",
    //   icon: <SchemaIcon size="24" />,
    // },

    {
      _tag: "SidebarNavItem",
      name: "Pasten",
      to: "/master-data/pastens",
      icon: <PastenIcon size="24" />,
    },
    {
      _tag: "SidebarNavItem",
      name: "Template Pola Tanam",
      to: "/master-data/plant-pattern-template",
      icon: <CheckBoardIcon size="24" />,
    },
    {
      _tag: "SidebarNavItem",
      name: "Golongan",
      to: "/master-data/groups",
      icon: <CheckMarkIcon size="24" />,
    },
    {
      _tag: "SidebarNavItem",
      name: "Area Lahan",
      to: "/master-data/areas",
      icon: <AreaIcon size="24" />,
    },
    {
      _tag: "SidebarNavItem",
      name: "Saluran",
      to: "/master-data/lines",
      icon: <Line2Icon size="24" />,
    },
    {
      _tag: "SidebarNavItem",
      name: "Titik Bangunan",
      to: "/master-data/nodes",
      icon: <NodeIcon size="24" />,
    },
    {
      _tag: "SidebarNavItem",
      name: "Pengaturan",
      to: "/configuration",
      icon: <SettingIcon size="24" />,
    }
  );

export { _nav };
