"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Buttons";
import ChangeProfileButton from "@/components/ChangeProfileButton/ChangeProfileButton";
import DropDownInput from "@/components/Input/DropDownInput";
import TextAreaInput from "@/components/Input/TextAreaInput";
import TextInput from "@/components/Input/TextInput";
import { createData, getData, updateData } from "@/services/baseService";
import formDataToObject from "@/utils/formDataToObject";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

const AccountManagementForm: React.FC<any> = ({ id }: { id?: string }) => {
  const [data, setData] = useState<any>({});
  const navigation = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const pageName = id ? "Edit Data" : "Tambah Data";
  const url = "/accounts";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = formDataToObject(new FormData(formRef.current));
    const formatData: any = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      mobile_phone_number: formData.mobile_phone_number,
      status: formData.status === "true" ? true : false,
      profile_pic: formData.profile_pic,
      //user
      ktp: formData.ktp,
      gender: formData.gender,
      blood_type: formData.blood_type,
      address: {
        address: formData.address,
      },
    };
    if (id) {
      await updateData(url, id, formatData);
    } else {
      await createData(url, formatData);
      navigation.back();
    }
  };

  const fetchAllData = useCallback(async () => {
    if (id) await getData(url, id, setData);
  }, [id]);
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Breadcrumb pageName={pageName}>
        <div className="flex justify-end gap-5 ">
          <Link href={"/account-management"}>
            <Button
              label="Back"
              color="bg-aktired-40"
              className="w-[120px] h-[46px] text-white"
            />
          </Link>
          <Button
            label="Submit"
            color="bg-aktigreen-30"
            className="w-[120px] h-[46px] text-white"
          />
        </div>
      </Breadcrumb>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5">
          <h2 className="text-xl font-semibold mb-2">Data Akun</h2>
          <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
            <div className="w-full xl:w-full">
              <TextInput
                name="username"
                data={data.account?.username}
                required
                label="Username"
                placeholder="Username"
              />
              <br></br>
              <TextInput
                required
                label="No HP"
                placeholder="No HP"
                name="mobile_phone_number"
                data={data.account?.mobile_phone_number}
              />
            </div>
            <div className="w-full xl:w-full">
              <TextInput
                required
                label="Nama"
                placeholder="Nama"
                name="name"
                data={data.account?.name}
              />
              <br></br>
              <DropDownInput
                required
                label="Status Pengguna"
                name="status"
                data={data.account?.status.toString()}
                options={[
                  {
                    label: "Aktif",
                    value: true,
                  },
                  {
                    label: "Tidak Aktif",
                    value: false,
                  },
                ]}
              />
            </div>
            <div className="w-full xl:w-full">
              <TextInput
                required
                label="Email"
                placeholder="Email"
                name="email"
                data={data.account?.["email"]}
              />
              <br></br>
              <DropDownInput
                required
                name="role"
                data={data.account?.role}
                label="Hak Akses"
                options={[
                  {
                    value: "",
                    label: "Pilih Hak Akses",
                  },
                  {
                    value: "juru_pintu",
                    label: "Juru Pintu",
                  },
                ]}
              />
            </div>
            <div className="ml-8">
              <ChangeProfileButton
                name="profile_pic"
                images={data.account?.profile_pic}
              />
            </div>
          </div>
          <div className="mb-4 border-t border-gray-300" />
          <h2 className="text-xl font-semibold mb-2">Data User</h2>
          <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
            <div className="w-full xl:w-full">
              <TextInput
                label="Nomor KTP"
                placeholder="Nomor KTP"
                name="ktp"
                data={data.user?.ktp}
              />
            </div>
            <DropDownInput
              required
              name="gender"
              data={data.user?.gender}
              label="Jenis Kelamin"
              options={[
                {
                  label: "Laki-laki",
                  value: "m",
                },
                {
                  label: "Perempuan",
                  value: "f",
                },
              ]}
            />

            <DropDownInput
              name="blood_type"
              data={data.user?.blood_type}
              label="Golongan Darah"
              options={[
                {
                  label: "A",
                  value: "A",
                },
                {
                  label: "B",
                  value: "B",
                },
                {
                  label: "O",
                  value: "O",
                },
                {
                  label: "AB",
                  value: "AB",
                },
              ]}
            />
          </div>
          <div className="mb-4 border-t border-gray-300"></div>
          <h2 className="text-xl font-semibold mb-2">Data Alamat</h2>
          <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-1 gap-3">
            <TextAreaInput
              required
              label="Alamat"
              placeholder="Alamat"
              name="address"
              data={data.user?.["address"]["address"]}
            />
          </div>
          {/* <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
            <DropDownInput
              required
              name="province"
              data={data.user?.["address"]["province"]}
              label="Provinsi"
              // disabled={allProvince.length !== 0 ? false : true}
              options={[
                {
                  label: "Pilih",
                  value: "",
                },
                // ...allProvince,
              ]}
              // onChange={onChangeProvince}
            />
            <DropDownInput
              required
              name="city"
              data={data.user?.["address"]["city"]}
              label="Kota"
              // disabled={regencies.length !== 0 ? false : true}
              options={[
                {
                  label: "Pilih",
                  value: "",
                },
                // ...regencies,
              ]}
              // onChange={onChangeRegencies}
            />
            <DropDownInput
              required
              name="district"
              data={data.user?.["address"]["district"]}
              label="Kecamatan"
              // disabled={district.length !== 0 ? false : true}
              options={[
                {
                  label: "Pilih",
                  value: "",
                },
                // ...district,
              ]}
              // onChange={onChangeDistrict}
            />
            <div className="w-full xl:w-full">
              <DropDownInput
                required
                name="subdistrict"
                data={data.user?.["address"]["subdistrict"]}
                label="Kelurahan"
                // disabled={subdistrict.length !== 0 ? false : true}
                options={[
                  {
                    label: "Pilih",
                    value: "",
                  },
                  // ...subdistrict,
                ]}
              />
            </div>
            <TextInput
              required
              name="postal_code"
              data={data.user?.["address"]["postal_code"]}
              label="Kode Pos"
              placeholder="Kode Pos"
            />
          </div> */}
        </div>
      </div>
    </form>
  );
};

export default AccountManagementForm;
