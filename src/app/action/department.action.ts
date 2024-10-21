'use server'

import Department from '@/models/Department'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
 import Employe from '@/models/Employe'

/* ----- team ----- */
export const getDepartments = async (search?: any) => {
    await connect()

    try {
        const allDepartments = await Department.find(buildQuery(search)).populate({ path: 'parent', model: Department })
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allDepartments))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleDepartment = async (id: string) => {
    await connect()

    try {
        const singleDepartment = await Department.findById(id).populate([{ path: 'users', model: Employe, populate: { path: 'department_id',select:'name', model: Department } }, { path: 'parent', model: Department }])
        return JSON.parse(JSON.stringify(singleDepartment))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createDepartment = async (body: any) => {
    await connect()
    try {
        await Department.create(body)
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ثبت کارمند' }
    }
}

export const editDepartment = async (id: string, body: any) => {
    await connect()
    try {
        let updatedDepartment = await Department.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedDepartment))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const deleteDepartment = async (teamId: string) => {
    await connect()

    try {
        const found = await Department.findById(teamId)

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
