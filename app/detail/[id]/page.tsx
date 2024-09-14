/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Buttons/Buttons";
import DropdownButton from "@/components/DropdownButtons/DropdownButton";
import Pagination from "@/components/Pagination/Pagination";
import { DownloadIcon, FilterIcon, IconImage, IconMKP, IconPDF, SearchIcon } from "@/public/images/icon/icon";
import { PaginationProps } from "@/types/pagination";
import { IconAlignJustified, IconChevronLeft, IconCircleArrowRightFilled, IconCloudDownload, IconDownload, IconInfoCircleFilled } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type IrigasiDataT = {
  id: string,
  name: string,
  description: string,
  image: string
}

const LandingPage = () => {
  const navigation = useRouter();
  const pathname = usePathname();

  const [hashValue, setHashValue] = useState<"information"|"download">('information');
  const [search, setSearch] = useState<string>("");
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    page: 1,
    totalDocs: 1,
    totalPages: Math.ceil(1 / 12),
    limit: 12,
  });
  
  const dataDefault: IrigasiDataT = {
    id: "sample5",
    name: "Sample Name 5",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, necessitatibus vitae quisquam expedita architecto voluptatum unde ut. Pariatur iste, corrupti necessitatibus eveniet ex dolores, laudantium, consequatur quos minima sint voluptatum?",
    image: "/images/sample/sample5.jpg"
  }

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    setHashValue(hash == "download" ? hash : "information" );
  }, []);

  return (
    <div className="new-layout-main" >
      <header className="header-layout px-[50px] pt-4 pb-[50px]" style={{backgroundImage : `url(${dataDefault.image})`}}>
        <div className="header-main">
          <div className="main-logo glassmorp">
            <img alt="logo" src="/images/logo/logoairso.png" />
          </div>
          <Button 
            className="btn-round glassmorp" 
            color="bg-[#00000033] text-white" 
            icon={<IconInfoCircleFilled size="18" />} 
            label="Informasi Aplikasi" 
          />
        </div>
        <div className="item-title glassmorp">
          {dataDefault.name}
        </div>
      </header>
      <div className="content-layout px-[50px] grid-content">
        <div className="sidebar-layout">
          <span className="font-bold text-[#1F1F1F] text-[20px]">Informasi Lainnya</span>
          <a href="#information" onClick={() => setHashValue("information")}>
            <Button 
              className="btn-round w-full !justify-center"
              color={hashValue !== "information" ? "bg-[#E1F0FF] text-primary": undefined}
              icon={<IconAlignJustified size="18" />} 
              label="Informasi Irigasi"
            />
          </a>
          <a href="#download" onClick={() => setHashValue("download")}>
            <Button 
              className="btn-round w-full !justify-center"
              color={hashValue !== "download" ? "bg-[#E1F0FF] text-primary": undefined}
              icon={<IconCloudDownload size="18" />} 
              label="Download Informasi"
            />
          </a>
          <Link href="/">
            <Button 
              className="btn-round w-full !justify-center"
              color="bg-[#E1F0FF] text-primary" 
              icon={<IconChevronLeft size="18" />} 
              label="Pilih Irigasi Lainnya"
            />
          </Link>
          <Link href={"/auth/signin"}>
            <Button 
              className="btn-round w-full !justify-center"
              color="bg-[#E1F0FF] text-primary" 
              icon={<IconCircleArrowRightFilled size="18" />} 
              label="Masuk Ke Aplikasi"
            />
          </Link>
        </div>
        {hashValue == "information" && <div className="flex flex-col gap-3">
          <img alt="cover" src={dataDefault.image} className="object-cover rounded-md" width="100%" height="auto" />
          {Array(10).fill(null).map((_,i) => (
            <div key={i} className="rounded-md border border-[#D7E1EA] p-3">
              <span className="font-bold text-lg pb-3">Lorem, ipsum.</span>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. At minus voluptas odio enim ducimus repellat quasi consequatur modi culpa sapiente eos provident totam libero omnis dolorum autem, facere, dignissimos fuga, hic consectetur laborum vero suscipit. Dignissimos nisi ipsam eligendi illo illum, iure, natus accusamus molestias dolore numquam laboriosam laborum omnis itaque fuga ea odit facilis, magnam necessitatibus. Atque deleniti cumque perferendis natus, laudantium itaque animi excepturi consectetur nesciunt nostrum, sapiente eaque praesentium expedita, illo repellendus aut inventore ut soluta dolore libero veritatis. Quas dolor dicta, nisi natus voluptas doloribus sint et sapiente a, architecto fugiat magnam obcaecati quibusdam iure voluptates!</p>
            </div>
          ))}
        </div>}
        {hashValue == "download" && <div className="flex flex-col gap-4 rounded-md border border-[#D7E1EA] p-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[#3F4254]">Informasi Daerah Irigasi {dataDefault.name}</span>
              <span className="text-sm font-semibold text-[#A1A5B7]">Total <span className="text-[#3F4254]">50</span> data</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-5 ">
              <div className="flex gap-3 bg-[#F9F9F9] rounded-xl p-3">
                <SearchIcon />
                <input
                  className="bg-[#F9F9F9] focus:outline-none"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="Pencarian"
                />
              </div>
              <button className="bg-transparent flex gap-3">
                <FilterIcon />
                <span className="font-semibold">Filter</span>
              </button>
              <DropdownButton
                className="p-3"
                style={{
                  backgroundColor: "#EEF6FF",
                  color: "#1F3368",
                }}
                label="Aksi"
                options={[
                  {
                    label: "Tambah Data",
                    action: (e: any) => {
                      navigation.push(pathname + "/form");
                    },
                  },
                ]}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border border-[#D7E1EA] p-2 flex flex-col gap-2 items-center">
              <span className="text-xs font-semibold text-[#3F4254]">Judul file</span>
              <IconImage size="70"/>
              <span className="text-xs font-semibold text-[#3E97FF]">file size</span>
              <Button 
                className="btn-round w-full !justify-center"
                color="bg-[#D7F9EF] text-[#04AA77]"
                icon={<DownloadIcon />} 
                label="Download File"
              />
            </div>
            <div className="rounded-md border border-[#D7E1EA] p-2 flex flex-col gap-2 items-center">
              <span className="text-xs font-semibold text-[#3F4254]">Judul file</span>
              <IconMKP size="70"/>
              <span className="text-xs font-semibold text-[#3E97FF]">file size</span>
              <Button 
                className="btn-round w-full !justify-center"
                color="bg-[#D7F9EF] text-[#04AA77]"
                icon={<DownloadIcon />} 
                label="Download File"
              />
            </div>
            <div className="rounded-md border border-[#D7E1EA] p-2 flex flex-col gap-2 items-center">
              <span className="text-xs font-semibold text-[#3F4254]">Judul file</span>
              <IconPDF size="70"/>
              <span className="text-xs font-semibold text-[#3E97FF]">file size</span>
              <Button 
                className="btn-round w-full !justify-center"
                color="bg-[#D7F9EF] text-[#04AA77]"
                icon={<DownloadIcon />} 
                label="Download File"
              />
            </div>
          </div>

          {paginationData && (
          <div className="mt-3">
            <Pagination
              {...paginationData}
              onNumberClick={(currentNumber) => {
                setPaginationData({
                  ...paginationData,
                  page: currentNumber,
                });
              }}
            />
          </div>
        )}
        </div>}
      </div>
    </div>
  );
};

export default LandingPage;
