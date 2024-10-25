"use client";

import { useParams } from "next/navigation";
import FileManagerPage from "../page";

const FileManagerParamsPage = () => {
  const { id } = useParams();
  return <FileManagerPage id={id as string} />;
};

export default FileManagerParamsPage;
