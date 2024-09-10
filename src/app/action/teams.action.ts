'use server'

import Teams from '@/models/Teams'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Expert from '@/models/Expert'
import User from '@/models/User'

/* ----- team ----- */
export const getTeams = async (search?: any) => {
    await connect()

    try {
        const allTeams = await Teams.find(buildQuery(search))
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allTeams))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleTeam = async (id: string) => {
    await connect()

    try {
        const singleTeam = await Teams.findById(id).populate({ path: 'users', model: Expert, populate: [{ path: 'user_id', model: User }] })
        return JSON.parse(JSON.stringify(singleTeam))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createTeam = async (body: any) => {
    await connect()
    try {
        await Teams.create(body)
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ثبت کارمند' }
    }
}

export const editTeam = async (id: string, body: any) => {
    await connect()
    try {
        let updatedTeam = await Teams.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedTeam))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}
export const editDialog = async (id: string, body: any) => {
    await connect()
    let time = Date.now()
    try {
        let team = await Teams.findById(id)
        for (let i = 0; i < team.dialog.length; i++) {
            if (team.dialog[i]._id == body.dialogTextId) {
                team.dialog[i].text = body.text
                team.dialog[i].editedTime = time
                await team.save()
            }
        }
        return JSON.parse(JSON.stringify(team))
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
        let updatedTeam = await Teams.findByIdAndUpdate(id, { $push: { dialog: data } }, { new: true })
        return JSON.parse(JSON.stringify(updatedTeam))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const deleteTeam = async (teamId: string) => {
    await connect()

    try {
        const found = await Teams.findById(teamId)

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
