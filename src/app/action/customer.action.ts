'use server'

import Expert from '@/models/Expert'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Customer from '@/models/Customer'
import Employe from '@/models/Employe'
import CustomerCat from '@/models/CustomerCategory'
import Contact from '@/models/Contact'
import Company from '@/models/Company'

/* ----- LEAD ----- */
export const getCustomers = async (search?: any) => {
    await connect()

    try {
        const allCustomers = await Customer.find(buildQuery(search)).populate([{ path: 'expert', populate: { path: 'employe_id', model: Employe } }, { path: 'contactId', model: Contact }])
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allCustomers))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleCustomer = async (id: string) => {
    await connect()

    try {
        const singleCustomer = await Customer.findById(id).populate([{ path: 'contactId', model: Contact, populate: ([{ path: 'categoryId', select: 'name', model: CustomerCat }, { path: 'companyId', select: 'name', model: Company }]) }, { path: 'expert', select: 'employe_id', model: Expert, populate: ({ path: 'employe_id', select: 'name', model: Employe }) }])
        return JSON.parse(JSON.stringify(singleCustomer))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createCustomer = async (body: any, convertor: string) => {
    await connect()
    let id = body?.contactId
    let time = Date.now()
    let data = await Customer.findOne({ contactId: id })
    if (data?._id == null) {
        try {
            body.convert = { convertor: convertor, time: time }
            let res = await Customer.create(body)
            return JSON.parse(JSON.stringify(res))
        } catch (error) {
            console.log(error)
            return { error: 'خطا در تبدیل مخاطب' }
        }
    } else {
        return { error: 'این مخاطب قبلا تبدیل شده است' }
    }
}

export const editCustomer = async (id: string, body: any, editor: string) => {
    await connect()
    let time = Date.now()
    try {
        let updatedCustomer = await Customer.findByIdAndUpdate(id, { ...body, $push: { edits: { time, editor } } }, { new: true })
        return JSON.parse(JSON.stringify(updatedCustomer))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const editDialog = async (id: string, body: any, expertId: string) => {
    await connect()
    let time = Date.now()
    try {
        let customer = await Customer.findById(id)
        for (let i = 0; i < customer.dialog.length; i++) {
            if (customer.dialog[i]._id == body.dialogTextId) {
                customer.dialog[i].text = body.text
                customer.dialog[i].editedTime = time
                customer.dialog[i].expert = expertId
                await customer.save()
            }
        }
        return JSON.parse(JSON.stringify(customer))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const addDialog = async (id: string, body: any, expertId: string) => {
    await connect()
    let time = Date.now()
    let data = { text: body, time: time, expert: expertId }
    try {
        let updatedCustomer = await Customer.findByIdAndUpdate(id, { $push: { dialog: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedCustomer))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const addCallStatus = async (id: string, body: any, expertId: string) => {
    await connect()
    let time = Date.now()
    let data = { status: body, time: time, expert: expertId }
    try {
        let updatedCustomer = await Customer.findByIdAndUpdate(id, { $push: { call: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedCustomer))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const deleteCustomer = async (customerId: string) => {
    await connect()

    try {
        const found = await Customer.findById(customerId)

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
