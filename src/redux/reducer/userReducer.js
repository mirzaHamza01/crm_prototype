import { ACCOUNT_DOC, SAVE_TOKEN } from "../constant";

let initialState = {
  docData: [],
  token: "",
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACCOUNT_DOC:
      return {
        ...state,
        docData: action.payload,
      };
    case SAVE_TOKEN:
      return {
        ...state,
        token: action.payload,
      };

    default:
      return state;
  }
};
