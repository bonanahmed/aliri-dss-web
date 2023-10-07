"use client";

import { useParams } from "next/navigation";
import GolonganFormPage from "../page";

const GolonganFormParamsPage = () => {
  const { id } = useParams();
  return <GolonganFormPage id={id as string} />;
};

export default GolonganFormParamsPage;
