"use client";

import { useParams } from "next/navigation";
import TitikFormPage from "../page";

const TitikFormParamsPage = () => {
  const { id } = useParams();

  return <TitikFormPage id={id as string} />;
};

export default TitikFormParamsPage;
