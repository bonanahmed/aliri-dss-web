"use client";
import { useParams } from "next/navigation";
import PastenFormPage from "../page";
const PastenFormPageParams = () => {
  const { id } = useParams();

  return <PastenFormPage id={id as string} />;
};

export default PastenFormPageParams;
