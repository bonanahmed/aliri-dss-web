"use client";

import { useParams } from "next/navigation";
import SaluranFormPage from "../page";

const SaluranFormPageParams = () => {
  const { id } = useParams();
  return <SaluranFormPage id={id as string} />;
};

export default SaluranFormPageParams;
