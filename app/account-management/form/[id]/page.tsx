"use client"
import { useParams } from "next/navigation";
import AccountManagementForm from "../page";
const AccountManagementFormParams = () => {
const { id } = useParams();

  return <AccountManagementForm id={id as string} />;
};

export default AccountManagementFormParams;
