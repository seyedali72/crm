'use server'

import Company from '@/models/Company'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Contact from '@/models/Contact'
import CustomerCat from '@/models/CustomerCategory'
import Lead from '@/models/Lead'
import Customer from '@/models/Customer'

/* ----- Contact ----- */
export const getContacts = async (search?: any) => {
    await connect()

    try {
        const allContacts = await Contact.find(buildQuery(search)).populate([{ path: 'categoryId', select: 'name', model: CustomerCat }, { path: 'companyId', select: 'name', model: Company }])
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allContacts))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleContact = async (id: string) => {
    await connect()

    try {
        const singleContact = await Contact.findById(id).populate([{ path: 'categoryId', model: CustomerCat }, { path: 'companyId', model: Company }])
        return JSON.parse(JSON.stringify(singleContact))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createContact = async (body: any) => {
    await connect()
    let find = await Contact.findById(body?._id)
    if (find !== undefined) {
        try {
            let res = await Contact.create(body)
            return JSON.parse(JSON.stringify(res))
        } catch (error) {
            console.log(error)
            return { error: 'خطا در ساخت شرکت' }
        }
    } else {
        return { error: 'این شرکت قبلا ثبت شده است' }
    }
}

export const editContact = async (id: string, body: any) => {
    await connect()

    try {
        let updatedContact = await Contact.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedContact))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const deleteContact = async (contactId: string) => {
    await connect()

    try {
        const found = await Contact.findById(contactId)

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

export const getCheckStatus = async (id: string) => {
    await connect()
    try {
        const lead = await Lead.findOne({ contactId: id })
        if (!lead?.isDeleted) {
            return JSON.parse(JSON.stringify({ 'lead': lead?._id }))
        }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const editLeadFromSource = async (id: any, body: any, editor: string) => {
    await connect()
    let time = Date.now()
    try {
        let updatedLead = await Lead.findOneAndUpdate(id, { ...body, $push: { edits: { time, editor } } }, { new: true })
        return JSON.parse(JSON.stringify(updatedLead))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر سرنخ' }
    }
}