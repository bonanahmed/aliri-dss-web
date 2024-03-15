"use client";

import { useParams } from "next/navigation";
import AreaFormPage from "../page";

const AreaFormParamPage = () => {
  const { id } = useParams();

  return <AreaFormPage id={id as string} />;
};

export default AreaFormParamPage;
