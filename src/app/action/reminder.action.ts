'use server'

 import connect from '../lib/db'
import Reminder from '@/models/Reminder'
import { buildQuery } from '../utils/helpers'
import Lead from '@/models/Lead'
import Opportunity from '@/models/Opportunity'

/* ----- Reminder ----- */
export const getReminders = async (search?: any) => {
	await connect()

	try {
		const allReminders = await Reminder.find(buildQuery(search)).populate([{ path: 'leadId', model: Lead }, { path: 'opportunityId', select: 'title', model: Opportunity }])
			.skip(search?.skip ? search?.skip : 0)
			.limit(search?.limit ? search?.limit : 0)
			.sort({ createdAt: -1 })
			.lean()

		return JSON.parse(JSON.stringify(allReminders))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربران' }
	}
}

export const getSingleReminder = async (id: string) => {
	await connect()

	try {
		const singleReminder = await Reminder.findById(id)
		return JSON.parse(JSON.stringify(singleReminder))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const createReminder = async (body: any) => {
	await connect()

	try {
		await Reminder.create(body)
		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ثبت کاربر' }
	}
}

export const editReminder = async (id: string, body: any) => {
	await connect()

	try {
		let updatedReminder = await Reminder.findByIdAndUpdate(id, body, { new: true })
		return JSON.parse(JSON.stringify(updatedReminder))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در تغییر کاربر' }
	}
}

export const deleteReminder = async (reminderId: string) => {
	await connect()

	try {
		const found = await Reminder.findById(reminderId)

		if (!found) {
			return { error: 'مقاله وجود ندارد' }
		}

		await found.softDelete()
		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: 'خطا در پاک کردن کاربر' }
	}
}
