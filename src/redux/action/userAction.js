import { USER_LOGIN } from "../constant";

export const userLoginAction = (payload) => async (dispatch) => {
  dispatch({
    type: USER_LOGIN,
    payload: payload,
  });
};
