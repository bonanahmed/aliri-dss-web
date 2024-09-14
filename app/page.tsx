/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/Buttons/Buttons";
import { IconAlignJustified, IconChevronRight, IconCircleArrowRightFilled, IconCloudDownload, IconInfoCircleFilled } from "@tabler/icons-react";
import Link from "next/link";
import { ReactNode, useState } from "react";

type IrigasiDataT = {
  id: string,
  name: string,
  description: string,
  image: string
}

const LandingPage = () => {
  const dataDefault: IrigasiDataT = {
    id: "default",
    name: "AIRSO",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, necessitatibus vitae quisquam expedita architecto voluptatum unde ut. Pariatur iste, corrupti necessitatibus eveniet ex dolores, laudantium, consequatur quos minima sint voluptatum?",
    image: "/images/sample/default.jpg"
  }
  const [listIrigasi, setListIrigasi] = useState<IrigasiDataT[]>(Array(10).fill(null).map((_, i) => ({
    id: `sample${i+1}`,
    name: `Sample Name ${i+1}`,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, necessitatibus vitae quisquam expedita architecto voluptatum unde ut.   Pariatur iste, corrupti necessitatibus eveniet ex dolores, laudantium, consequatur quos minima sint voluptatum?",
    image: `/images/sample/sample${i+1}.jpg`
  })));
  const [selected, setSelected] = useState<IrigasiDataT>(dataDefault);

  const renderTitle = (title: string):ReactNode => {
    const words = title.split(' ');
    let least = words.slice(1);
    return (
      <><span className="first-word">{words[0]}</span>{least.join(" ")}</>
    )
  }

  return (
    <div className="background-main" style={{backgroundImage : `url(${selected.image})`}}>
      <div className="background-gradient">
        <header className="header-main px-[50px] pt-4">
          <div className="main-logo glassmorp" onClick={() => setSelected(dataDefault)}>
            <img alt="logo" src="/images/logo/logoairso.png" />
          </div>
          <Button 
            className="btn-round glassmorp" 
            color="bg-[#00000033] text-white" 
            icon={<IconInfoCircleFilled size="18" />} 
            label="Informasi Aplikasi" 
          />
        </header>
        <aside className="sidebar-main pl-[50px] mt-10">
          {listIrigasi.map((item, i) => {
            const isActive = item.id === selected.id;

            return (
              <div key={i} className={`sidebar-item ${isActive? "active":""}`} onClick={() => setSelected(isActive? dataDefault: item)}>
                <div className={`sidebar-content glassmorp ${isActive? "active":""}`}>
                  <img alt="logo" src={item.image} />
                  <span>{item.name}</span>
                  {isActive && <div className="rounded-[50%] text-black bg-[#00000033] w-[33px] h-[33px] flex justify-center items-center">
                    <IconChevronRight size={28}/>
                  </div>}
                </div>
              </div>
            )
          })}
        </aside>

        <footer className="footer-main">
          <div className="footer-content"> 
            <span className="footer-title text-right">{renderTitle(selected.name)}</span>
            <p className="footer-desc text-right">{selected.description}</p>
            <div className="flex gap-4 justify-end">
              {selected.id != "default" && 
              <Link href={`/detail/${selected.id}#download`}>
                <Button 
                  className="btn-round glassmorp" 
                  color="bg-[#00000033] text-white" 
                  icon={<IconCloudDownload size="18" />} 
                  label="Download Informasi" 
                />
              </Link>}
              {selected.id != "default" && 
              <Link href={`/detail/${selected.id}#informasi`}>
                <Button 
                  className="btn-round glassmorp" 
                  color="bg-[#00000033] text-white" 
                  icon={<IconAlignJustified size="18" />} 
                  label="Informasi Irigasi" 
                />
              </Link>}
              <Link href={"/auth/signin"}>
                <Button 
                  className="btn-round glassmorp"
                  color="bg-[#FFFFFF80] text-primary" 
                  label={<div className="flex items-center gap-4">Masuk Aplikasi <IconCircleArrowRightFilled size="18" /></div>}
                />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
