'use server'

import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import User from '@/models/User'

/* ----- LEAD ----- */
export const getUsers = async (search?: any) => {
    await connect()

    try {
        const allUsers = await User.find(buildQuery(search))
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allUsers))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleUser = async (id: string) => {
    await connect()

    try {
        const singleUser = await User.findById(id)
        return JSON.parse(JSON.stringify(singleUser))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createUser = async (body: any) => {
    await connect()
    try {
        await User.create(body)
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ثبت کارمند' }
    }
}

export const editUser = async (id: string, body: any) => {
    await connect()
    try {
        let updatedUser = await User.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const editDialog = async (id: string, body: any) => {
    await connect()
    let time = Date.now()
    try {
        let user = await User.findById(id)
        for (let i = 0; i < user.dialog.length; i++) {
            if (user.dialog[i]._id == body.dialogTextId) {
                user.dialog[i].text = body.text
                user.dialog[i].editedTime = time
                await user.save()
            }
        }
        return JSON.parse(JSON.stringify(user))
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
        let updatedUser = await User.findByIdAndUpdate(id, { $push: { dialog: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedUser))
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
        let updatedUser = await User.findByIdAndUpdate(id, { $push: { call: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const deleteUser = async (userId: string) => {
    await connect()

    try {
        const found = await User.findById(userId)

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
