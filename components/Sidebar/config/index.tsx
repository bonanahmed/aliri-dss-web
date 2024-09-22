import {
  HomeIcon,
  Database2Icon,
  AccountManagementIcon,
  PastenIcon,
  CheckBoardIcon,
  CheckMarkIcon,
  AreaIcon,
  Line2Icon,
  NodeIcon,
  ScadaIcon,
  CCTV2Icon,
  PapanDigitalIcon,
  SettingIcon,
  FlowIcon,
} from "@/public/images/icon/icon";
import { IconHome2 } from "@tabler/icons-react";

export const getNav = (userData: any) => {
  const _nav = [
    {
      _tag: "SidebarNavItem",
      name: "Beranda",
      to: "/",
      icon: <IconHome2 size="24" />,
    },
    {
      _tag: "SidebarNavItem",
      name: "Map",
      to: "/maps",
      icon: <HomeIcon size="24" />,
    },
    // {
    //   _tag: "SidebarNavItem",
    //   name: "Informasi Daerah Irigasi",
    //   to: "/information/document",
    //   icon: <AccountManagementIcon size="24" />,
    // },
    // {
    //   _tag: "SidebarNavDropdown",
    //   name: "Informasi Daerah Irigasi",
    //   route: "/information",
    //   icon: <AccountManagementIcon size="24" />,
    //   _children: [
    //     {
    //       _tag: "SidebarNavItem",
    //       name: "Skema Peta Jaringan",
    //       to: "/information/schema",
    //     },
    //     {
    //       _tag: "SidebarNavItem",
    //       name: "Dokumen",
    //       to: "/information/document",
    //     },
    //   ],
    // },

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
      _tag: "SidebarNavDropdown",
      name: "Data Debit",
      route: "/flow",
      icon: <FlowIcon size="24" />,
      _children: [
        {
          _tag: "SidebarNavItem",
          name: "Rekap Debit",
          to: "/flow/summary",
        },
        {
          _tag: "SidebarNavItem",
          name: "Debit Aktual",
          to: "/flow/actual",
        },

        // {
        //   _tag: "SidebarNavItem",
        //   name: "Riwayat Debit",
        //   to: "/flow/history",
        // },
      ],
    },
    {
      _tag: "SidebarNavItem",
      name: "CCTV",
      to: "/cctv",
      icon: <CCTV2Icon size="24" />,
    },
  ];

  if (userData)
    _nav.push({
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
    });
  if (userData && userData?.role !== "operator")
    _nav.push(
      {
        _tag: "SidebarNavItem",
        name: "Scada",
        to: "http://202.169.239.21/SCADA.BBWSSO/",
        icon: <ScadaIcon size="24" />,
      },
      {
        _tag: "SidebarNavItem",
        name: "Data Akun",
        to: "/account-management",
        icon: <AccountManagementIcon size="24" />,
      }
    );

  if (
    userData &&
    (userData?.role === "superadmin" ||
      userData?.role === "admin" ||
      userData?.role === "operator")
  )
    _nav.push(
      // {
      //   _tag: "SidebarNavItem",
      //   name: "Skema",
      //   to: "/schema",
      //   icon: <SchemaIcon size="24" />,
      // },
      {
        _tag: "SidebarNavDropdown",
        name: "Master Data",
        route: "/master-data",
        icon: <AreaIcon size="24" />,
        _children: [
          {
            _tag: "SidebarNavItem",
            name: "Pasten",
            to: "/master-data/pastens",
          },
          {
            _tag: "SidebarNavItem",
            name: "Template Pola Tanam",
            to: "/master-data/plant-pattern-template",
          },
          {
            _tag: "SidebarNavItem",
            name: "Golongan",
            to: "/master-data/groups",
          },
          {
            _tag: "SidebarNavItem",
            name: "Area Lahan",
            to: "/master-data/areas",
          },
          {
            _tag: "SidebarNavItem",
            name: "Saluran",
            to: "/master-data/lines",
          },
          {
            _tag: "SidebarNavItem",
            name: "Titik Bangunan",
            to: "/master-data/nodes",
          },
        ],
      }

      // {
      //   _tag: "SidebarNavItem",
      //   name: "Pasten",
      //   to: "/master-data/pastens",
      //   icon: <PastenIcon size="24" />,
      // },
      // {
      //   _tag: "SidebarNavItem",
      //   name: "Template Pola Tanam",
      //   to: "/master-data/plant-pattern-template",
      //   icon: <CheckBoardIcon size="24" />,
      // },
      // {
      //   _tag: "SidebarNavItem",
      //   name: "Golongan",
      //   to: "/master-data/groups",
      //   icon: <CheckMarkIcon size="24" />,
      // },
      // {
      //   _tag: "SidebarNavItem",
      //   name: "Area Lahan",
      //   to: "/master-data/areas",
      //   icon: <AreaIcon size="24" />,
      // },
      // {
      //   _tag: "SidebarNavItem",
      //   name: "Saluran",
      //   to: "/master-data/lines",
      //   icon: <Line2Icon size="24" />,
      // },
      // {
      //   _tag: "SidebarNavItem",
      //   name: "Titik Bangunan",
      //   to: "/master-data/nodes",
      //   icon: <NodeIcon size="24" />,
      // }
    );
  if (
    userData &&
    (userData?.role === "superadmin" || userData?.role === "admin")
  )
    _nav.push({
      _tag: "SidebarNavDropdown",
      name: "Pengaturan",
      route: "/configuration",
      icon: <SettingIcon size="24" />,
      _children: [
        {
          _tag: "SidebarNavItem",
          name: "Umum",
          to: "/configuration/general",
        },
        // {
        //   _tag: "SidebarNavItem",
        //   name: "Daerah Irigasi",
        //   to: "/configuration/daerah-irigasi",
        // },
      ],
    });

  return _nav;
};
