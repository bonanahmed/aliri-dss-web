import Address from "./Address";
import Career from "./Career";
import LastEducation from "./LastEducation";

interface User{
    account_id:string,
    KTP:string,
    gender:string,
    religion:string,
    blood_type:string,
    family_status:string,
    PTKP:string,
    NPWP:string,
    BPJS:string,
    last_education:LastEducation,
    address:Address,
    career:Career,
    created_at:string,
    updated_at:string,
    id:string
}

export default User;