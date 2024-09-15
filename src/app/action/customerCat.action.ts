'use server'

 import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Expert from '@/models/Expert'
import Employe from '@/models/Employe'
import CustomerCat from '@/models/CustomerCategory'
 
/* ----- customerCat ----- */
export const getCustomerCats = async (search?: any) => {
    await connect()

    try {
        const allCustomerCats = await CustomerCat.find(buildQuery(search))
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allCustomerCats))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleCustomerCat = async (id: string) => {
    await connect()

    try {
        const singleCustomerCat = await CustomerCat.findById(id).populate({ path: 'users', model: Expert, populate: [{ path: 'employe_id', model: Employe }] })
        return JSON.parse(JSON.stringify(singleCustomerCat))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createCustomerCat = async (body: any) => {
    await connect()
    try {
        await CustomerCat.create(body)
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ثبت کارمند' }
    }
}

export const editCustomerCat = async (id: string, body: any) => {
    await connect()
    try {
        let updatedCustomerCat = await CustomerCat.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedCustomerCat))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
 

export const deleteCustomerCat = async (customerCatId: string) => {
    await connect()

    try {
        const found = await CustomerCat.findById(customerCatId)

        if (!found) {
            return { error: 'مقاله وجود ندارد' }
        }

        await found.softDelete()
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در پاک کردن کارمند' }
    }
}
