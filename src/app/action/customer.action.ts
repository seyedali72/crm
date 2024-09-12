'use server'

import Expert from '@/models/Expert'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Customer from '@/models/Customer'
import Employe from '@/models/Employe'
 
/* ----- LEAD ----- */
export const getCustomers = async (search?: any) => {
    await connect()

    try {
        const allCustomers = await Customer.find(buildQuery(search)).populate({ path: 'expert', populate: { path: 'employe_id', model: Employe } })
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
        const singleCustomer = await Customer.findById(id).populate([{ path: 'expert', model: Expert, populate: [{ path: 'employe_id', model: Employe }] }])
        return JSON.parse(JSON.stringify(singleCustomer))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createCustomer = async (body: any, convertor: any) => {
    let time = Date.now()
    body.convert = { convertor: convertor, time: time }
    await connect()
    try {
        await Customer.create(body)
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ثبت کارمند' }
    }
}

export const editCustomer = async (id: string, body: any) => {
    await connect()
    try {
        let updatedCustomer = await Customer.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedCustomer))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const editDialog = async (id: string, body: any) => {
    await connect()
    let time = Date.now()
    try {
        let customer = await Customer.findById(id)
        for (let i = 0; i < customer.dialog.length; i++) {
            if (customer.dialog[i]._id == body.dialogTextId) {
                customer.dialog[i].text = body.text
                customer.dialog[i].editedTime = time
                await customer.save()
            }
        }
        return JSON.parse(JSON.stringify(customer))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const addDialog = async (id: string, body: any) => {
    await connect()
    let time = Date.now()
    let data = { text: body, time: time }
    try {
        let updatedCustomer = await Customer.findByIdAndUpdate(id, { $push: { dialog: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedCustomer))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const addCallStatus = async (id: string, body: any) => {
    await connect()
    let time = Date.now()
    let data = { status: body, time: time }
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
