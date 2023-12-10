import { atom } from "recoil";

const defaultModalState = {
  open: false,
  view: "login",
};

export const authModalState = atom({
  key: "authModalState",
  default: defaultModalState,
});





