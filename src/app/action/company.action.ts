'use server'

import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Company from '@/models/Company'
import CustomerCat from '@/models/CustomerCategory'
import Contact from '@/models/Contact'
import Expert from '@/models/Expert'

/* ----- company ----- */
export const getCompanies = async (search?: any) => {
    await connect()

    try {
        const allCompanies = await Company.find(buildQuery(search)).populate([{ path: 'categoryId', model: CustomerCat }])
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allCompanies))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleCompany = async (id: string) => {
    await connect()

    try {
        const singleCompany = await Company.findById(id).populate([{ path: 'categoryId', model: CustomerCat }])
        return JSON.parse(JSON.stringify(singleCompany))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createCompany = async (body: any) => {
    await connect()
    let find = await Company.findById(body?._id)
    if (find !== undefined) {
        try {
            await Company.create(body)
            return { success: true }
        } catch (error) {
            console.log(error)
            return { error: 'خطا در ساخت شرکت' }
        }
    } else {
        return { error: 'این شرکت قبلا ثبت شده است' }
    }
}

export const editCompany = async (id: string, body: any, editor: string) => {
    await connect()
    let time = Date.now()
    try {
        let updatedCompany = await Company.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedCompany))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const addContactToCompany = async (id: string, body: any) => {
    await connect()

    try {
        let result = await Company.findByIdAndUpdate(id, { $push: { users: body } }, { new: true })
        await Contact.findByIdAndUpdate(body, { companyId: result?._id })

        return JSON.parse(JSON.stringify(result))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const editContactCompany = async (id: string, body: any, lastCompanyId: any) => {
    await connect()
    try {
        let remove = await Company.findByIdAndUpdate(lastCompanyId, { $pull: { users: body } }, { new: true })
        let add = await Company.findByIdAndUpdate(id, { $push: { users: body } }, { new: true })
        let res = await Contact.findByIdAndUpdate(body, { companyId: add?._id })
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const deleteCompany = async (companyId: string) => {
    await connect()

    try {
        const found = await Company.findById(companyId)

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
