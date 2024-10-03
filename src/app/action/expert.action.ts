 'use server'

import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Expert from '@/models/Expert'
import Team from '@/models/Team';
import Lead from '@/models/Lead';
import Employe from '@/models/Employe';
import Customer from '@/models/Customer';
import Contact from '@/models/Contact';
import { cookies } from 'next/headers';

/* ----- expert ----- */
export const getExperts = async (search?: any) => {
    await connect()

    try {
        const allExperts = await Expert.find(buildQuery(search)).populate([{ path: 'employe_id', model: Employe }, { path: 'teams', model: Team }])
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allExperts))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleExpert = async (id: string) => {
    await connect()

    try {
        const singleExpert = await Expert.findById(id).populate([{ path: 'teams', model: Team }, { path: 'employe_id', select: 'name national_code', model: Employe }, { path: 'leads', model: Lead, populate: ([{ path: 'contactId', select: 'name status phone_number_1', model: Contact }]) }, { path: 'customers', model: Customer, populate: ([{ path: 'contactId', select: 'name status phone_number_1', model: Contact }]) }])
        return JSON.parse(JSON.stringify(singleExpert))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createExpert = async (body: any) => {
    await connect()
    try {
        let res = await Expert.create(body)
        await Team.findByIdAndUpdate(body?.teams, { $push: { users: res?._id } }, { new: true })
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ثبت کارمند' }
    }
}

export const editExpert = async (id: string, body: any) => {
    await connect()
    try {
        let updatedExpert = await Expert.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedExpert))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const addLeadToExpert = async (id: string, expertId: string) => {
    await connect()

    try {
        let updatedExpert = await Expert.findByIdAndUpdate(expertId, { $push: { leads: id } }, { new: true })
        return JSON.parse(JSON.stringify(updatedExpert))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const deleteLeadFromExpert = async (id: string, expertId: string) => {
    await connect()

    try {
        let updatedExpert = await Expert.findByIdAndUpdate(expertId, { $pull: { leads: id } }, { new: true })
        return JSON.parse(JSON.stringify(updatedExpert))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const addCustomerToExpert = async (id: string, body: any, expertId: string) => {
    await connect()
    try {
        let updatedExpert = await Expert.findByIdAndUpdate(expertId, { ...body, $push: { customers: id } }, { new: true })
        return JSON.parse(JSON.stringify(updatedExpert))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const removeCustomerFromExpert = async (id: string, expertId: any) => {
    await connect()

    try {
        let updatedExpert = await Expert.findByIdAndUpdate(expertId, { $pull: { customers: id } }, { new: true })
        return JSON.parse(JSON.stringify(updatedExpert))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const deleteExpert = async (expertId: string) => {
    await connect()

    try {
        const found = await Expert.findById(expertId)

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

export const signinExpert = async (body: any) => {
    await connect()
    try {
        const found = await Expert.findOne({ isDeleted: false, user_name: body.user_name, password: body.password, }).populate({ path: 'employe_id', select: 'name mobile_number', model: Employe })
        const forCoockie = { name: found.employe_id.name, mobile_number: found.employe_id.mobile_number, user_name: found.user_name, _id: found._id, role: 9, userType: 'expert', isDeleted: false }
        if (forCoockie) {
            cookies().set('user', JSON.stringify(forCoockie))
            return JSON.parse(JSON.stringify(forCoockie))
        }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ورود کارشناس' }
    }
}

export const addDialogToEx = async (id: string, body: any, contactId: string) => {
    await connect()
    let time = Date.now()
    let data = { text: body, time: time, contact: contactId }
    try {
        let updatedExpert = await Expert.findByIdAndUpdate(id, { $push: { dialogs: data } }, { new: true })
        console.log(updatedExpert)
        return JSON.parse(JSON.stringify(updatedExpert))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const addCallToEx = async (id: string, contactId: string, body: any) => {
    await connect()
    let time = Date.now()
    let data = { status: body, time: time, contact: contactId }
    try {
        let updatedExpert = await Expert.findByIdAndUpdate(id, { $push: { calls: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedExpert))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}