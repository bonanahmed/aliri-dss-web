"use client";
import { useParams } from "next/navigation";
import PlantPatternTemplateFormPage from "../page";
const PlantPatternTemplateFormPageParams = () => {
  const { id } = useParams();

  return <PlantPatternTemplateFormPage id={id as string} />;
};

export default PlantPatternTemplateFormPageParams;
