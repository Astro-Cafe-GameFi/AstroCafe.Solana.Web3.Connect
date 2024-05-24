export const SET_USE_MAINNET = 'SET_USE_MAINNET';

const initialState = {
    useMainnet: false,
}

export const setUseMainnetAction = (useMainnet: boolean) => {
    return {
        type: SET_USE_MAINNET,
        useMainnet
    }
}

const reducer = (state = initialState, action: any) => {
    switch(action.type) {
        case SET_USE_MAINNET:
            return {
                ...state,
                useMainnet: action.useMainnet
            }
        default: 
            return state;
    }
}

export default reducer;
