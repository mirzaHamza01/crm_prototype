import axios from "axios";

const restApi = async (url, axiosType, restData) => {
  try {
    const response = await axios({
      method: `${axiosType}`,
      url: `${url}`,
      data: axiosType !== "get" && restData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        Authorization: axiosType === "get" && "Bearer " + `${restData}`,
      },
    });
    return response.data;
  } catch (e) {
    return e;
  }
};

export async function restApiGetAccessToken() {
  const url = "http://localhost/suiteCrm/Api/access_token";
  const data = {
    grant_type: "client_credentials",
    client_id: "44f207df-3341-fd53-0063-61e66343e8ab",
    client_secret: "12345",
  };
  const response = await restApi(url, "post", data);

  return response.access_token;
}

export async function restApiRequest(
  token,
  single = false,
  id = null,
  pageNo = 1
) {
  const response2 = single
    ? await restApi(
        `http://localhost/suiteCrm/Api/V8/module/Accounts/${id}`,
        "get",
        token
      )
    : await restApi(
        `http://localhost/suiteCrm/Api/V8/module/Accounts?sort=name&page[number]=${pageNo}&page[size]=3`,
        "get",
        token
      );

  return response2.data;
}

export async function restApiGetAccounts(token) {
  const response2 = await restApi(
    `http://localhost/suiteCrm/Api/V8/module/Accounts?fields[Account]=id&sort=name`,
    "get",
    token
  );

  return response2.data;
}

export async function restApiGetFilterAccount(token, name) {
  const response2 = await restApi(
    `http://localhost/suiteCrm/Api/V8/module/Accounts?filter[operator]=and&filter[name][eq]=${name}`,
    "get",
    token
  );

  return response2.data;
}
