// Redux
import { resetMessage } from "../slices/photoSlice";

export const useReetComponentMessage = (dispatch) => {
    return () => {
        setTimeout(() => {
            dispatch(resetMessage())
        }, 2000);
    };
};