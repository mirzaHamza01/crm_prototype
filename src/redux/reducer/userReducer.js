import { USER_LOGIN } from "../constant";

let initialState = {
  login: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...state,
        login: action.payload,
      };

    default:
      return state;
  }
};
