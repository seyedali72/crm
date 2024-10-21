'use server'

import Employe from '@/models/Employe'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Department from '@/models/Department'
import { cookies } from 'next/headers'

/* ----- LEAD ----- */
export const getEmployes = async (search?: any) => {
    await connect()

    try {
        const allEmployes = await Employe.find(buildQuery(search)).populate({ path: 'department_id' })
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
        const singleEmploye = await Employe.findById(id).populate({ path: 'department_id' })
        return JSON.parse(JSON.stringify(singleEmploye))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}
export const createEmploye = async (body: any) => {
    await connect()
    try {
        let res = await Employe.create(body)
        await Department.findByIdAndUpdate(body?.department_id, { $push: { users: res?._id } }, { new: true })
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ثبت کارمند' }
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

export const signinEmployee = async (body: any) => {

    await connect()
    try {
        const found = await Employe.findOne({ isDeleted: false, national_code: body.user_name, mobile_number: body.password, })
        const forCoockie = { name: found.name, mobile_number: found.mobile_number, user_name: found.national_code, _id: found._id, role: found.role, userType: 'employee', isDeleted: false }
        if (forCoockie) { 
            cookies().set('user', JSON.stringify(forCoockie))
            return JSON.parse(JSON.stringify(forCoockie))
        }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ورود کارمند' }
    }
}