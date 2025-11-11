import { isAxiosError } from 'axios'
import api from '../config/axios'

export async function getProducts() {
    try {
        const { data } = await api.post('inventory/Products');
        console.log(data)

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error)
        }
    }
}