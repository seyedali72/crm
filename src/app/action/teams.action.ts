'use server'

import Team from '@/models/Team'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Expert from '@/models/Expert'
import Employe from '@/models/Employe'

/* ----- team ----- */
export const getTeams = async (search?: any) => {
    await connect()

    try {
        const allTeams = await Team.find(buildQuery(search)).populate({ path: 'parent', model: Team })
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
        const singleTeam = await Team.findById(id).populate([{ path: 'users', model: Expert, populate: [{ path: 'employe_id', model: Employe }] },{path:'parent',model:Team}])
        return JSON.parse(JSON.stringify(singleTeam))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createTeam = async (body: any) => {
    await connect()
    try {
        await Team.create(body)
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ثبت کارمند' }
    }
}

export const editTeam = async (id: string, body: any) => {
    await connect()
    try {
        let updatedTeam = await Team.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedTeam))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const deleteTeam = async (teamId: string) => {
    await connect()

    try {
        const found = await Team.findById(teamId)

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
