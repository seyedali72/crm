'use server'

import Expert from '@/models/Expert'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Opportunity from '@/models/Opportunity'
import Employe from '@/models/Employe'
import Lead from '@/models/Lead'
import Contact from '@/models/Contact'
import Company from '@/models/Company'

/* ----- Opportunity ----- */
export const getOpportunities = async (search?: any) => {
    await connect()

    try {
        const allOpportunities = await Opportunity.find(buildQuery(search)).select('-edits -dialog -call').populate([{ path: 'expert', select: 'employe_id', populate: { path: 'employe_id', select: 'name', model: Employe } }, { path: 'leadId',select:'name _id', model: Lead }])
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allOpportunities))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleOpportunity = async (id: string) => {
    await connect()

    try {
        const singleOpportunity = await Opportunity.findById(id).populate([{ path: 'leadId', select: 'companyId contactId isCompany', model: Lead, populate: ([{ path: 'contactId', select: 'name', model: Contact }, { path: 'companyId', select: 'name', model: Company }]) }, { path: 'expert', select: 'employe_id', model: Expert, populate: ({ path: 'employe_id', select: 'name', model: Employe }) }])
        return JSON.parse(JSON.stringify(singleOpportunity))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createOpportunity = async (body: any) => {

    await connect()
    try {
        let res = await Opportunity.create(body)
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تبدیل مخاطب' }
    }
}

export const editOpportunity = async (id: string, body: any, editor: string) => {
    await connect()
    let time = Date.now()
    try {
        let updatedOpportunity = await Opportunity.findByIdAndUpdate(id, { ...body, $push: { edits: { time, editor } } }, { new: true })
        return JSON.parse(JSON.stringify(updatedOpportunity))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const editDialogOpp = async (id: string, body: any, expertId: string) => {
    await connect()
    let time = Date.now()
    try {
        let opportunity = await Opportunity.findById(id)
        for (let i = 0; i < opportunity.dialog.length; i++) {
            if (opportunity.dialog[i]._id == body.dialogTextId) {
                opportunity.dialog[i].text = body.text
                opportunity.dialog[i].editedTime = time
                opportunity.dialog[i].expert = expertId
                await opportunity.save()
            }
        }
        return JSON.parse(JSON.stringify(opportunity))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const addDialogOpp = async (id: string, body: any, expertId: string) => {
    await connect()
    let time = Date.now()
    let data = { text: body, time: time, expert: expertId }
    let datalead = { text: body, time: time, expert: expertId }
    try {
        let updatedOpportunity = await Opportunity.findByIdAndUpdate(id, { $push: { dialog: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedOpportunity))
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
        let updatedOpportunity = await Opportunity.findByIdAndUpdate(id, { $push: { call: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedOpportunity))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const deleteOpportunity = async (opportunityId: string) => {
    await connect()

    try {
        const found = await Opportunity.findById(opportunityId)

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
