import axios from "axios";
import configData from "../config.json";

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
  const url = `${configData.SIDE_URL}${configData.SERVER_URL_ACCESS_TOKEN}`;
  const data = {
    grant_type: configData.ACCESS_TOKEN_DATA.GRANT_TYPE,
    client_id: configData.ACCESS_TOKEN_DATA.USER_ID,
    client_secret: configData.ACCESS_TOKEN_DATA.USER_SECRET,
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
        `${configData.SIDE_URL}${configData.MODULE.SERVER_URL_MODULE_ACCESS}/${configData.MODULE.MODULE_NAME}/${id}`,
        "get",
        token
      )
    : await restApi(
        `${configData.SIDE_URL}${configData.MODULE.SERVER_URL_MODULE_ACCESS}/${configData.MODULE.MODULE_NAME}?sort=name&page[number]=${pageNo}&page[size]=3`,
        "get",
        token
      );

  return response2.data;
}

export async function restApiGetAccounts(token) {
  const response2 = await restApi(
    `${configData.SIDE_URL}${configData.MODULE.SERVER_URL_MODULE_ACCESS}/${configData.MODULE.MODULE_NAME}?fields[${configData.MODULE.MODULE_NAME_FOR_API_ACCESS}]=id&sort=name`,
    "get",
    token
  );

  return response2.data;
}

export async function restApiGetUserDocuments(token, id) {
  const response2 = await restApi(
    `${configData.SIDE_URL}${configData.MODULE.SERVER_URL_MODULE_ACCESS}/${configData.MODULE.MODULE_NAME}/${id}/relationships/documents`,
    "get",
    token
  );
  return response2.data;
}

export async function restApiCreateUserDocuments(
  accountId,
  status,
  file,
  name,
  revision,
  date,
  category,
  description,
  token,
  orgFile
) {
  let url = `${configData.SIDE_URL}${configData.MODULE.SERVER_URL_MODULE_ACCESS}`;

  const docData = file
    ? {
        data: {
          type: "Document",
          attributes: {
            name: `${name}`,
            document_name: `${name}`,
            revision: `${revision}`,
            category_id: `${category}`,
            status: `${status}`,
            description: `${description}`,
            active_date: `${date}`,
            filename: orgFile.name,
            filecontents: `${file}`,
            file_ext: orgFile.type,
          },
        },
      }
    : {
        data: {
          type: "Document",
          attributes: {
            name: `${name}`,
            document_name: `${name}`,
            revision: `${revision}`,
            category_id: `${category}`,
            status: `${status}`,
            description: `${description}`,
            active_date: `${date}`,
          },
        },
      };
  let response;
  await axios({
    method: `post`,
    url: `${url}`,
    data: docData,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
      Authorization: "Bearer " + `${token}`,
    },
  }).then(async (res) => {
    url = `${configData.SIDE_URL}${configData.MODULE.SERVER_URL_MODULE_ACCESS}/${configData.MODULE.MODULE_NAME}/${accountId}/relationships`;
    let response2 = await axios({
      method: `post`,
      url: `${url}`,
      data: {
        data: {
          type: "Document",
          id: `${res.data.data.id}`,
        },
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        Authorization: "Bearer " + `${token}`,
      },
    });
    response = response2;
  });

  return response;
}

export async function restApiGetFilterAccount(token, name) {
  const response2 = await restApi(
    `${configData.SIDE_URL}${configData.MODULE.SERVER_URL_MODULE_ACCESS}/${configData.MODULE.MODULE_NAME}?filter[operator]=and&filter[name][eq]=${name}`,
    "get",
    token
  );

  return response2.data;
}

//login and resgister

export async function restApiLoginUser(token, name) {
  const response = await restApi(
    `${configData.SIDE_URL}${configData.MODULE.SERVER_URL_MODULE_ACCESS}/${configData.USER_MODULE_NAME}?filter[user_name][eq]=${name}`,
    "get",
    token
  );

  return response.data;
}
