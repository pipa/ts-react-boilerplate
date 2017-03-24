import { IStars, IStarsAction } from "models/starsModel";

/** Action Types */
export const GET_REQUEST: string = "stars/GET_REQUEST";
export const GET_SUCCESS: string = "stars/GET_SUCCESS";
export const GET_FAILURE: string = "stars/GET_FAILURE";

/** Initial State */
const initialState: IStars = {
  isFetching: false
};

/** Reducer */
export function starsReducer(state: IStars = initialState, action: IStarsAction): IStars {
  switch (action.type) {
    case GET_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });

    case GET_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        count: action.payload.count
      });

    case GET_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: action.payload.message,
        error: true
      });

    default:
      return state;
  }
}

/** Async Action Creator */
export function getStars(): (dispatch: any) => Promise<IStars> {
  return (dispatch) => {
    dispatch(starsRequest());

    return fetch("https://api.github.com/repos/barbar/vortigern")
      .then((res) => {
        if (res.ok) {
          return res.json()
            .then((repo) => dispatch(starsSuccess(repo.stargazers_count)));
        } else {
          return res.json()
            .then((starsErr) => dispatch(starsFailure(starsErr)));
        }
      })
      .catch((err) => dispatch(starsFailure(err)));
  };
}

/** Action Creator */
export function starsRequest(): IStarsAction {
  return {
    type: GET_REQUEST
  };
}

/** Action Creator */
export function starsSuccess(count: number): IStarsAction {
  return {
    type: GET_SUCCESS,
    payload: {
      count
    }
  };
}

/** Action Creator */
export function starsFailure(message: any): IStarsAction {
  return {
    type: GET_FAILURE,
    payload: {
      message
    }
  };
}
