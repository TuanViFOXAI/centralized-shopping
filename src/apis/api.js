import axios from 'axios';
import authHeader from '../services/auth-header';
const API_URL = import.meta.env.VITE_APP_API;
const API_URL_V2 = import.meta.env.VITE_APP_API_PM;

class API {
    //---------------- Toản -----------------------------
    get_tree(api) {
        return axios.get(API_URL + api, { headers: authHeader() });
    }
    add_new(data, api) {
        return axios.post(API_URL + api, data, { headers: authHeader() });
    }

    update(data, api) {
        return axios.put(API_URL + api, data, { headers: authHeader() });
    }

    delete(card_code, api) {
        return axios.delete(API_URL + api, { headers: authHeader(), data: card_code });
    }
    //---------------- Anh Tụ -----------------------------

    //** Get async return response */
    /**
     * Gửi yêu cầu GET không đồng bộ đến điểm cuối API được chỉ định.
     *
     * @function getAsync
     * @param {string} patch - Điểm cuối API mà yêu cầu GET được gửi tới.
     * @param {Object} params - Các tham số truy vấn sẽ được gửi cùng với yêu cầu GET.
     * @returns {Promise} - Một lời hứa giải quyết phản hồi của yêu cầu GET.
     *
     * @example
     * // Ví dụ:
     * const response = await API.getAsync('/api/data', { page: 1, limit: 10 });
     */
    async getAsync(patch, params) {
        const res = await axios.get(API_URL_V2 + patch, { params: params, headers: authHeader() });
        // if (res.status) {
        //     window.location.replace('/no-permission');
        //     throw new Error('Unauthorized');
        // }
        return res;
    }

    /**
     * Sends an asynchronous PUT request to the specified API endpoint.
     *
     * @param {string} patch - The API endpoint to which the PUT request is sent.
     * @param {Object} data - The data to be sent in the body of the PUT request.
     * @returns {Promise} - A promise that resolves to the response of the PUT request.
     */
    async putAsync(patch, data) {
        const res = await axios.put(API_URL_V2 + patch, data, { headers: authHeader() });
        // if (res.status === 200) {
        //     window.location.replace('/no-permission');
        //     throw new Error('Unauthorized');
        // }
        return res;
    }

    /**
     * Sends an asynchronous PATCH request to the specified API endpoint.
     *
     * @function patchAsync
     * @param {string} patch - The API endpoint to which the PATCH request is sent.
     * @param {Object} data - The data to be sent in the body of the PATCH request.
     * @returns {Promise} - A promise that resolves to the response of the PATCH request.
     *
     * @example
     * // Example usage:
     * const response = await API.patchAsync('/api/update', { id: 1, name: 'New Name' });
     * console.log(response.data);
     */
    async patchAsync(patch, data) {
        const res = await axios.patch(API_URL_V2 + patch, data, { headers: authHeader() });
        if (res.status === 401) {
            window.location.replace('/no-permission');
            throw new Error('Unauthorized');
        }
        return res;
    }

    /**
     * Sends an asynchronous POST request to the specified API endpoint with form data.
     *
     * @function postAsync
     * @param {string} patch - The API endpoint to which the POST request is sent.
     * @param {FormData} formData - The form data to be sent in the body of the POST request.
     * @returns {Promise} - A promise that resolves to the response of the POST request.
     *
     * @example
     * // Example usage:
     * const formData = new FormData();
     * formData.append('file', fileInput.files[0]);
     * const response = await API.postAsync('/api/upload', formData);
     * console.log(response.data);
     */
    async postAsync(patch, formData) {
        // const data = Buffer.from(binary);
        const headers = authHeader();
        const res = await axios.post(API_URL_V2 + patch, formData, { headers: headers });
        if (res.status === 401) {
            window.location.replace('/no-permission');
            throw new Error('Unauthorized');
        }
        return res;
    }

    async deleteAsync(path,id) {
        // const data = Buffer.from(binary);
        const headers = authHeader();
        const res = await axios.delete(API_URL_V2+ path +'/' + id, { headers: headers });
        if (res.status === 401) {
            window.location.replace('/no-permission');
            throw new Error('Unauthorized');
        }
        return res;
    }

    async get_all(api) {
        return await axios.get(API_URL_V2 + api, { headers: authHeader() });
    }

    get_all_v2(api, data) {
        return axios.get(API_URL_V2 + api, { params: data.data, headers: authHeader() });
    }

    add_new_v2(data, api) {
        return axios.post(API_URL_V2 + api, data, { headers: authHeader() });
    }

    update_v2(data, api) {
        return axios.put(API_URL_V2 + api, data, { headers: authHeader() });
    }

    delete_v2(card_code, api) {
        return axios.delete(API_URL_V2 + api, { headers: authHeader(), data: card_code });
    }
}

export default new API();
