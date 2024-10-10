'use server'
import User from '@/models/User'
import { nanoid } from 'nanoid'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import connect from '../lib/db'
import Client from '@/models/Client'

export const signinUser = async (body: any) => {

	await connect()
	try {
		const found = await User.findOne({
			isDeleted: false,  
			user_name: body.user_name,
			password: body.password,
		})
		if (found) {
			cookies().set('user', JSON.stringify(found))
			return JSON.parse(JSON.stringify(found))
		}
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ثبت کاربر' }
	}
}

export const signupUser = async (body: any) => {
	await connect()
	try {
		const newUser = await User.create({ user_name: body.user_name, name: nanoid(), password: body.password, role: body.role })
		cookies().set('user', JSON.stringify(newUser))
		return JSON.parse(JSON.stringify(newUser))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ثبت کاربر' }
	}
}

export const signinClient = async (body: any) => {
console.log('signinClient')
	await connect()
	try {
		const found = await Client.findOne({
			isDeleted: false, 
			user_name: body.user_name,
			password: body.password,
		})
		if (found) {
			cookies().set('user', JSON.stringify(found))
			return JSON.parse(JSON.stringify(found))
		}
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ثبت کاربر' }
	}
}

export const signupClient = async (body: any) => {
console.log('signupClient')
	await connect()
	try {
		const newUser = await Client.create({ user_name: body.user_name, name: nanoid(6), password: body.password, mobile_number: body.mobile_number, role: body.role})
		cookies().set('user', JSON.stringify(newUser))
		return JSON.parse(JSON.stringify(newUser))
	} catch (error) {
		console.log(error)
		return { error: 'خطا در ثبت کاربر' }
	}
}

export const signoutUser = async () => {
	cookies().delete('user')
	redirect('/')
}
