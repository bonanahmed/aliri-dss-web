import axios from "axios";

let intervalId: any;
const getToken = async () => {
  try {
    const body = {
      AccountName: "ADMINISTRATOR",
      Password: "wiratama1791",
      Timeout: 99999,
    };
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_TOPKAPI_API}/TopkapiService/LogIn`,
      body
    );

    return response.data.LogInResult.Token;
  } catch (error) {
    console.log("TOPKAPI API ERROR:", error);
    throw error;
  }
};
const getVar = async (Token: string, label: string) => {
  try {
    const body: any = {
      Token,
    };
    if (label) body.TagNameFilter = label;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_TOPKAPI_API}/TopkapiService/GetVar`,
      body
    );
    return response.data.GetVarResult.VarList;
  } catch (error) {
    console.log("TOPKAPI API ERROR:", error);
    throw error;
  }
};

const getRealtimeValue = async (Token: string, FormulaList: any) => {
  try {
    const body: any = {
      Token,
      FormulaList,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_TOPKAPI_API}/TopkapiService/GetRealTimeValues`,
      body
    );
    return response.data.GetRealTimeValuesResult.ValueList;
  } catch (error) {
    console.log("TOPKAPI API ERROR:", error);
    throw error;
  }
};

export const getDataTOPKAPI = async (setValue: any, label: string) => {
  const Token = await getToken();
  const varList = (await getVar(Token, label)).map(
    (item: any, index: number) => {
      return {
        Formula: item.TagName,
        Formatted: true,
      };
    }
  );
  intervalId = setInterval(async () => {
    const realValue = await getRealtimeValue(Token, varList);
    setValue(realValue);
  }, 5000);
};

export const resetData = () => {
  clearInterval(intervalId);
};
