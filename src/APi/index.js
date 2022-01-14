import axios from "axios";

const restApi = async (url, axiosType, method, types, restData) => {
  try {
    const response = await axios({
      method: `${axiosType}`,
      url: `${url}?method=${method}&${types}&rest_data=${restData}`,
      headers: {
        "Access-Control-Allow-Origin":
          "http://localhost/suiteCrm/service/v4_1/rest.php",
      },
    });
    return response.data;
  } catch (e) {
    return e;
  }
};

const restApiRequest = async () => {
  const url = "https://demo.suiteondemand.com/service/v4_1/rest.php";
  const types = "input_type=JSON&response_type=JSON";
  const restData = `{"user_auth":{"user_name":"will","password":"18218139eec55d83cf82679934e5cd75"}}`;
  const response = await restApi(url, "post", "login", types, restData);
  const restData2 = `{"session":"${response.id}","module_name": "Accounts"}`;
  try {
    const response2 = await restApi(
      url,
      "get",
      "get_entry_list",
      types,
      restData2
    );
    return response2;
  } catch (e) {
    return e;
  }
};

export default restApiRequest;
