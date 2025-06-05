var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
export const API_BASE_URL = 'http://localhost:5000/api';
export const fetchStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios.get(`${API_BASE_URL}/whatsapp/stats`);
    return response.data;
});
export const fetchCosts = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios.get(`${API_BASE_URL}/whatsapp/costs`);
    return response.data;
});
export const getLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios.get(`${API_BASE_URL}/whatsapp/logs`);
    return response.data;
});
