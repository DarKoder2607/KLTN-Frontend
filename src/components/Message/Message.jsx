import { message } from "antd";

const success = (mes = 'Success') => {
    message.success(mes);
};
const successSignup = (mes = 'Đăng ký thành công !!!') => {
    message.success(mes);
};


const error = (mes = 'Error') => {
    message.error(mes);
};

const warning = (mes = 'Warning') => {
    message.warning(mes);
};

export { success, error, warning ,successSignup}