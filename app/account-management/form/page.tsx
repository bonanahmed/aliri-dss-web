"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Button from "@/components/Buttons/Button";
import ChangeProfileButton from "@/components/Buttons/ChangeProfileButton";
import DropDownInput from "@/components/Inputs/DropDownInput";
import TextAreaInput from "@/components/Inputs/TextAreaInput";
import TextInput from "@/components/Inputs/TextInput";
import {
  addAccountData,
  getAccountData,
  getAllDivision,
  getAllEducationInstitution,
  getAllEmployeeStatus,
  getAllFamilyStatus,
  getAllFunctionalPosition,
  getAllMajorData,
  getAllPTKPData,
  getAllRoleData,
  getAllStructuralPosition,
  updateAccountData,
} from "@/services/account-management/form";
import {
  getAllProvince,
  getDistrict,
  getRegency,
  getSubDistrict,
} from "@/services/public/get-area";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

const AccountManagementForm: React.FC<any> = ({ id }: { id?: string }) => {
  const [data, setData] = useState<any>({});
  const formRef = useRef<HTMLFormElement>(null);
  const pageName = id ? "Edit Data" : "Tambah Data";
  const navigate = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    const formDataObject: any = {};
    formData.forEach((value, key) => {
      if (value) formDataObject[key] = value as string;
    });

    const formatData: any = {
      username: formDataObject.username,
      name: formDataObject.name,
      password: "Admin123",
      email: formDataObject.email,
      role: formDataObject.role,
      mobile_phone_number: formDataObject.mobile_phone_number,
      status: formDataObject.status,
      profile_pic: formDataObject.profile_pic,
      //user
      KTP: formDataObject.KTP,
      gender: formDataObject.gender,
      religion: formDataObject.religion,
      blood_type: formDataObject.blood_type,
      family_status: formDataObject.family_status,
      PTKP: formDataObject.PTKP,
      NPWP: formDataObject.NPWP,
      BPJS: formDataObject.BPJS,
      last_education: {
        education_level: formDataObject.education_level,
        major: formDataObject.major,
        institution_name: formDataObject.institution_name,
        title: formDataObject.title,
        degree: formDataObject.degree,
      },
      address: {
        address: formDataObject.address,
        district: formDataObject.district,
        subdistrict: formDataObject.subdistrict,
        city: formDataObject.city,
        province: formDataObject.province,
        postal_code: formDataObject.postal_code,
      },
      career: {
        entry_year: formDataObject.entry_year,
        employee_status: formDataObject.employee_status,
        division_id: formDataObject.division_id,
        structural_position: formDataObject.structural_position,
        functional_position: formDataObject.functional_position,
      },
    };
    if (id) {
      delete formatData.password;
      await updateAccountData(id, formatData as AccountManagementForm);
    } else {
      await addAccountData(formatData as AccountManagementForm);
      navigate.back();
    }
  };

  // Get Value Dropdown
  const [rolesData, setRolesData] = useState<any>([]);
  const [familyStatusData, setFamilyStatusData] = useState<any>([]);
  const [ptkpData, setPTKPData] = useState<any>([]);
  const [majorData, setMajorData] = useState<any>([]);
  const [educationalInstitutionData, setEducationalInstitutionData] =
    useState<any>([]);
  const [employeeStatusData, setEmployeeStatusData] = useState<any>([]);
  const [divisionData, setDivisionData] = useState<any>([]);
  const [structuralPositionData, setStructuralPositionData] = useState<any>([]);
  const [functionalPositionData, setFunctionalPositionData] = useState<any>([]);

  const fetchAllData = useCallback(async () => {
    await getAllRoleData(setRolesData);
    await getAllFamilyStatus(setFamilyStatusData);
    await getAllPTKPData(setPTKPData);
    await getAllMajorData(setMajorData);
    await getAllEducationInstitution(setEducationalInstitutionData);
    await getAllEmployeeStatus(setEmployeeStatusData);
    await getAllDivision(setDivisionData);
    await getAllStructuralPosition(setStructuralPositionData);
    await getAllFunctionalPosition(setFunctionalPositionData);
    if (id) await getAccountData(id, setData);
  }, [id]);
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const [allProvince, setAllProvince] = useState<any>([]);
  const [regencies, setRegencies] = useState<any>([]);
  const [district, setDistrict] = useState<any>([]);
  const [subdistrict, setSubDistrict] = useState<any>([]);

  useEffect(() => {
    getAllProvince(setAllProvince);
  }, []);

  useEffect(() => {
    getRegency(parseInt(data.user?.address?.province), setRegencies);
    getDistrict(parseInt(data.user?.address?.city), setDistrict);
    getSubDistrict(parseInt(data.user?.address?.district), setSubDistrict);
  }, [
    data.user?.address?.province,
    data.user?.address?.city,
    data.user?.address?.district,
  ]);

  const onChangeProvince = (e: any) => {
    getRegency(parseInt(e.target.value), setRegencies);
  };
  const onChangeRegencies = (e: any) => {
    getDistrict(parseInt(e.target.value), setDistrict);
  };
  const onChangeDistrict = (e: any) => {
    getSubDistrict(parseInt(e.target.value), setSubDistrict);
  };
  // useEffect(() => {

  // }, [id]);

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
                  ...rolesData,
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
                name="KTP"
                data={data.user?.KTP}
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
              required
              name="religion"
              data={data.user?.religion}
              label="Agama"
              options={[
                {
                  label: "Islam",
                  value: "islam",
                },
                {
                  label: "Kristen",
                  value: "kristen",
                },
                {
                  label: "Buddha",
                  value: "buddha",
                },
                {
                  label: "Hindu",
                  value: "hindu",
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
            <DropDownInput
              required
              name="family_status"
              data={data.user?.family_status}
              label="Status Keluarga"
              options={[
                {
                  value: "",
                  label: "Pilih Status Keluarga",
                },
                ...familyStatusData,
              ]}
            />
            <DropDownInput
              required
              name="PTKP"
              data={data.user?.["PTKP"]}
              label="Penghasilan Tidak Kena Pajak"
              options={[
                {
                  label: "Pilih PTKP",
                  value: "",
                },
                ...ptkpData,
              ]}
            />
            <div className="w-full xl:w-full">
              <TextInput
                label="NPWP"
                placeholder="NPWP"
                name="NPWP"
                data={data.user?.["NPWP"]}
              />
            </div>
            <div className="w-full xl:w-full">
              <TextInput
                label="BPJS"
                placeholder="BPJS"
                name="BPJS"
                data={data.user?.["BPJS"]}
              />
            </div>
          </div>
          <div className="mb-4 border-t border-gray-300"></div>
          <h2 className="text-xl font-semibold mb-2">
            Data Pendidikan Terakhir
          </h2>
          <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
            <div className="w-full xl:w-full">
              <DropDownInput
                required
                name="education_level"
                label="Jenjang Pendidikan"
                data={data.user?.["last_education"]["education_level"]}
                options={[
                  {
                    label: "SD",
                    value: "SD",
                  },
                  {
                    label: "SMP",
                    value: "SMP",
                  },
                  {
                    label: "SMA",
                    value: "SMA",
                  },
                  {
                    label: "SMK",
                    value: "SMK",
                  },
                  {
                    label: "S1",
                    value: "S1",
                  },
                  {
                    label: "S2",
                    value: "S2",
                  },
                  {
                    label: "S3",
                    value: "S3",
                  },
                ]}
              />
              <br></br>
              <TextInput
                label="Gelar Depan"
                placeholder="Gelar Depan"
                name="title"
                data={data.user?.["last_education"]["title"]}
              />
            </div>
            <div className="w-full xl:w-full">
              <DropDownInput
                required
                name="major"
                data={data.user?.["last_education"]["major"]}
                label="Jurusan"
                options={[
                  {
                    label: "Pilih Jurusan",
                    value: "",
                  },
                  ...majorData,
                ]}
              />
              <br></br>
              <TextInput
                name="degree"
                data={data.user?.["last_education"]["degree"]}
                label="Gelar Belakang"
                placeholder="Gelar Belakang"
              />
            </div>
            <DropDownInput
              required
              name="institution_name"
              data={data.user?.["last_education"]["institution_name"]}
              label="Nama Instansi Pendidikan"
              options={[
                {
                  label: "Pilih Institusi Pendidikan",
                  value: "",
                },
                ...educationalInstitutionData,
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

          <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
            <DropDownInput
              required
              name="province"
              data={data.user?.["address"]["province"]}
              label="Provinsi"
              disabled={allProvince.length !== 0 ? false : true}
              options={[
                {
                  label: "Pilih",
                  value: "",
                },
                ...allProvince,
              ]}
              onChange={onChangeProvince}
            />
            <DropDownInput
              required
              name="city"
              data={data.user?.["address"]["city"]}
              label="Kota"
              disabled={regencies.length !== 0 ? false : true}
              options={[
                {
                  label: "Pilih",
                  value: "",
                },
                ...regencies,
              ]}
              onChange={onChangeRegencies}
            />
            <DropDownInput
              required
              name="district"
              data={data.user?.["address"]["district"]}
              label="Kecamatan"
              disabled={district.length !== 0 ? false : true}
              options={[
                {
                  label: "Pilih",
                  value: "",
                },
                ...district,
              ]}
              onChange={onChangeDistrict}
            />
            <div className="w-full xl:w-full">
              <DropDownInput
                required
                name="subdistrict"
                data={data.user?.["address"]["subdistrict"]}
                label="Kelurahan"
                disabled={subdistrict.length !== 0 ? false : true}
                options={[
                  {
                    label: "Pilih",
                    value: "",
                  },
                  ...subdistrict,
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
            {/* <DropDownInput
              required
              name="postal_code"
              data={data.user?.["address"]["postal_code"]}
              label="Kode Pos"
              options={[
                {
                  label: "Pilih",
                  value: "",
                },
              ]}
            /> */}
          </div>
          <div className="mb-4 border-t border-gray-300"></div>
          <h2 className="text-xl font-semibold mb-2">Data Karir</h2>
          <div className="mb-4.5 grid grid-cols-1 xl:grid-cols-4 gap-3">
            <div className="w-full xl:w-full">
              <TextInput
                name="entry_year"
                data={data.user?.["career"]["entry_year"]}
                label="Tahun Masuk"
                placeholder="Tahun Masuk"
                type="date"
                required
              />
              <br></br>
              <DropDownInput
                required
                name="structural_position"
                data={data.user?.["career"]["structural_position"]}
                label="Jabatan Struktural"
                options={[
                  {
                    label: "Pilih Jabatan Struktural",
                    value: "",
                  },
                  ...structuralPositionData,
                ]}
              />
            </div>
            <div className="w-full xl:w-full">
              <DropDownInput
                required
                name="employee_status"
                data={data.user?.["career"]["employee_status"]}
                label="Status Pegawai"
                options={[
                  {
                    label: "Pilih Status Pegawai",
                    value: "=",
                  },
                  ...employeeStatusData,
                ]}
              />
              <br></br>
              <DropDownInput
                required
                name="functional_position"
                data={data.user?.["career"]["functional_position"]}
                label="Jabatan Fungsional"
                options={[
                  {
                    label: "Pilih Jabatan Fungsional",
                    value: "",
                  },
                  ...functionalPositionData,
                ]}
              />
            </div>

            <DropDownInput
              required
              name="division_id"
              data={data.user?.["career"]["division_id"]}
              label="Badan / Departemen / Divisi / Unit"
              options={[
                {
                  label: "Pilih Badan",
                  value: "",
                },
                ...divisionData,
              ]}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AccountManagementForm;
