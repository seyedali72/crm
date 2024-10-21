'use server'

import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
 import CustomerCat from '@/models/CustomerCategory'
 import Lead from '@/models/Lead'
import Company from '@/models/Company'
import Contact from '@/models/Contact'

/* ----- customerCat ----- */
export const getCustomerCats = async (search?: any) => {
    await connect()

    try {
        const allCustomerCats = await CustomerCat.find(buildQuery(search)).populate({ path: 'parent', model: CustomerCat })
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
        const singleCustomerCat = await CustomerCat.findById(id).populate([{ path: 'users', model: Contact }, { path: 'parent', model: CustomerCat }])
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

export const addLeatToCustomerCat = async (id: string, body: any, type: string) => {
    await connect()

    try {
        let result = await CustomerCat.findByIdAndUpdate(id, { $push: { users: body } }, { new: true })
        if (type == 'company') {
            await Company.findByIdAndUpdate(body, { categoryId: result?._id })
        } else {
            await Lead.findByIdAndUpdate(body, { categoryId: result?._id })
        }

        return JSON.parse(JSON.stringify(result))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const editLeadFromCustomerCat = async (id: string, body: any, type: string, last: any) => {
    await connect()

    try {
        let remove = await CustomerCat.findByIdAndUpdate(last, { $pull: { users: body } }, { new: true })
        if (remove !== undefined) {
            let result = await CustomerCat.findByIdAndUpdate(id, { $push: { users: body } }, { new: true })
            if (type == 'company') {
                await Company.findByIdAndUpdate(body, { categoryId: result?._id })
            } else {
                await Lead.findByIdAndUpdate(body, { categoryId: result?._id })
            }

            return JSON.parse(JSON.stringify(result))
        }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const removeContactFromCustomerCat = async (id: string, body: any) => {
    await connect()

    try {
        let result = await CustomerCat.findByIdAndUpdate(id, { $pull: { users: body } }, { new: true })
        let find = await Contact.findById(body)
        if (find == undefined) {
            await Company.findByIdAndUpdate(body, { categoryId: result?._id })
        } else {
            await Contact.findByIdAndUpdate(body, { categoryId: result?._id })
        }

        return JSON.parse(JSON.stringify(result))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}