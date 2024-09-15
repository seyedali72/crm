'use server'
 
import { cookies } from 'next/headers'
import connect from '../lib/db'
import User from '@/models/User'
import { buildQuery } from '../utils/helpers'

/* ----- USER ----- */
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
		return { error: 'خطا در دریافت کاربران' }
	}
}

export const getSingleUser = async (id: string) => {
	await connect()

	try {
		const singleUser = await User.findById(id) 
		return JSON.parse(JSON.stringify(singleUser))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const createUser = async (body: any) => {
	await connect()

	try {
		await User.create(body)
		return { success: true }
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ثبت کاربر' }
	}
}

export const editUser = async (id: string, body: any) => {
	await connect()

	try {
		let updatedUser = await User.findByIdAndUpdate(id, body, { new: true })
		cookies().set('user', JSON.stringify(updatedUser))
		return JSON.parse(JSON.stringify(updatedUser))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در تغییر کاربر' }
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
		return { error: 'خطا در پاک کردن کاربر' }
	}
}
