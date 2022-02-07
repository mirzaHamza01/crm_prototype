import { ACCOUNT_DOC, SAVE_TOKEN } from "../constant";

export const saveDocData = (payload) => async (dispatch) => {
  console.log({ payload });
  dispatch({
    type: ACCOUNT_DOC,
    payload: payload,
  });
};

export const saveToken = (payload) => async (dispatch) => {
  console.log({ payload });
  dispatch({
    type: SAVE_TOKEN,
    payload: payload,
  });
};
