import api from "./api";

const loanService = {
    createLoanApplication(data) {
        return api.post("/loans", data);
    },
};

export default loanService;
