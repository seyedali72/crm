'use server'

import Employe from '@/models/Employe'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
 
/* ----- LEAD ----- */
export const getEmployes = async (search?: any) => {
    await connect()

    try {
        const allEmployes = await Employe.find(buildQuery(search))
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allEmployes))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleEmploye = async (id: string) => {
    await connect()

    try {
        const singleEmploye = await Employe.findById(id)
        return JSON.parse(JSON.stringify(singleEmploye))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createEmploye = async (body: any) => {
    await connect()
    try {
        await Employe.create(body)
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ثبت کارمند' }
    }
}

export const editEmploye = async (id: string, body: any) => {
    await connect()
    try {
        let updatedEmploye = await Employe.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedEmploye))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const editDialog = async (id: string, body: any) => {
    await connect()
    let time = Date.now()
    try {
        let employe = await Employe.findById(id)
        for (let i = 0; i < employe.dialog.length; i++) {
            if (employe.dialog[i]._id == body.dialogTextId) {
                employe.dialog[i].text = body.text
                employe.dialog[i].editedTime = time
                await employe.save()
            }
        }
        return JSON.parse(JSON.stringify(employe))
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
        let updatedEmploye = await Employe.findByIdAndUpdate(id, { $push: { dialog: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedEmploye))
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
        let updatedEmploye = await Employe.findByIdAndUpdate(id, { $push: { call: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedEmploye))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const deleteEmploye = async (employeId: string) => {
    await connect()

    try {
        const found = await Employe.findById(employeId)

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
