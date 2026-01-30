let apiCallDepth = 0;
const MAX_API_CHAIN_DEPTH = 2;

export const ApiCallContext = {
    enter() {
        apiCallDepth += 1;

        if (apiCallDepth > MAX_API_CHAIN_DEPTH) {
            throw new Error(
                `API chaining limit exceeded. Max allowed is ${MAX_API_CHAIN_DEPTH}`
            );
        }
    },

    reset() {
        apiCallDepth = 0;
    },
    
    getCurrentDepth() {
        return apiCallDepth;
    },
    
    canMakeCall() {
        return apiCallDepth < MAX_API_CHAIN_DEPTH;
    }
};