'use server'

import Expert from '@/models/Expert'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Lead from '@/models/Lead'
import Employe from '@/models/Employe'
import CustomerCat from '@/models/CustomerCategory'
import Company from '@/models/Company'
import Contact from '@/models/Contact'

/* ----- LEAD ----- */
export const getLeads = async (search?: any) => {
    await connect()

    try {
        const allLeads = await Lead.find(buildQuery(search)).populate([{ path: 'expert', populate: { path: 'employe_id', model: Employe } }])
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allLeads))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleLead = async (id: string) => {
    await connect()

    try {
        const singleLead = await Lead.findById(id).populate([{ path: 'categoryId', select: 'name', model: CustomerCat }, { path: 'companyId', select: 'name', model: Company }, { path: 'contactId', select: 'name', model: Contact }, { path: 'expert', select: 'employe_id', model: Expert, populate: ({ path: 'employe_id', select: 'name', model: Employe }) }])
        return JSON.parse(JSON.stringify(singleLead))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت سرنخ' }
    }
}

export const createLead = async (body: any) => {
    await connect()

    let data = await Lead.findOne({ phone_number_1: body?.phone_number_1 })
    if (data?._id == null) {
        try {
            let res = await Lead.create(body)
            return JSON.parse(JSON.stringify(res))
        } catch (error) {
            console.log(error)
            return { error: 'خطا در ساخت سرنخ' }
        }
    } else {
        return { error: 'این سرنخ قبلا ایجاد شده است' }
    }
}

export const editLead = async (id: string, body: any, editor: string) => {
    await connect()
    let time = Date.now()
    try {
        let updatedLead = await Lead.findByIdAndUpdate(id, { ...body, $push: { edits: { time, editor } } }, { new: true })
        return JSON.parse(JSON.stringify(updatedLead))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر سرنخ' }
    }
}


export const editDialog = async (id: string, body: any, expertId: string) => {
    await connect()
    let time = Date.now()
    try {
        let lead = await Lead.findById(id)
        for (let i = 0; i < lead.dialog.length; i++) {
            if (lead.dialog[i]._id == body.dialogTextId) {
                lead.dialog[i].text = body.text
                lead.dialog[i].editedTime = time
                lead.dialog[i].expert = expertId
                await lead.save()
            }
        }
        return JSON.parse(JSON.stringify(lead))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر سرنخ' }
    }
}
export const addDialog = async (id: string, body: any, expertId: string) => {
    await connect()
    let time = Date.now()
    let data = { text: body, time: time, expert: expertId }
    try {
        let updatedLead = await Lead.findByIdAndUpdate(id, { $push: { dialog: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedLead))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر سرنخ' }
    }
}

export const addCallStatus = async (id: string, body: any, expertId: string) => {
    await connect()
    let time = Date.now()
    let data = { status: body, time: time, expert: expertId }
    try {
        let updatedLead = await Lead.findByIdAndUpdate(id, { $push: { call: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedLead))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر سرنخ' }
    }
}

export const deleteLead = async (leadId: string) => {
    await connect()

    try {
        const found = await Lead.findById(leadId)

        if (!found) {
            return { error: 'مقاله وجود ندارد' }
        }

        await found.softDelete()
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در پاک کردن سرنخ' }
    }
}
