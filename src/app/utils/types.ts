import { Types } from 'mongoose'

interface ICustomerCat {
	name: string
	status: string
	description: string
	parent?: Types.ObjectId
	users?: [Types.ObjectId]
	isDeleted?: boolean
	deletedAt?: Date
}

interface ITeams {
	name: string
	status: string
	description: string
	parent?: Types.ObjectId
	users?: [Types.ObjectId]
	isDeleted?: boolean
	deletedAt?: Date
}

interface ICategory {
	name: string
	slug: string
	cat_code: string
	thumbnail?: File
	parent?: Types.ObjectId
	description?: string
	isDeleted?: boolean
	deletedAt?: Date
}

interface IClient extends IUser {
	mobile_number: number
}

interface IExpert {
	employe_id: Types.ObjectId
	user_name: string
	password: string
	role:number
	roles?: string
	teams?: string
	title?: string
	email?: string
	status?: string
	type?: Types.ObjectId
	description?: string
	leads?: [Types.ObjectId]
	customers?: [Types.ObjectId]
	lastActivity: object
	isDeleted?: boolean
	deletedAt?: Date
}

interface IUser {
	name: string
	user_name: string
	password: string
	role?: string
	email?: string
	isDeleted?: boolean
	deletedAt?: Date
}

interface ICustomer {
	name: string
	mobile_number: string
	website?: string
	title?: string
	address?: string
	expert?: Types.ObjectId
	email?: string
	status?: string
	source?: string
	convert?: object
	description?: string
	dialog?: string
	edits?: string[]
	call: string
	isDeleted?: boolean
	deletedAt?: Date
}

interface ILead {
	name: string
	mobile_number: string
	website?: string
	title?: string
	address?: string
	expert?: Types.ObjectId
	creator: Types.ObjectId
	email?: string
	status?: string
	source?: string
	description?: string
	dialog?: string[]
	call?: string[]
	edits?: string[]
	isDeleted?: boolean
	deletedAt?: Date
}

interface IEmploye {
	name: string
	national_code: string
	gender: string
	isDeleted?: boolean
	deletedAt?: Date
}

interface IFile {
	fileName: string
	fileAddress: string
	fileSize?: string
	altText?: string
	mimeType?: string
	thumbnails?: [
		{
			url: string
			size: string
		},
	]
}

interface IOTP {
	lead_phone: string
	otp: string
	expireAt: Date
}

interface IPage {
	name: string
	slug: string
	content: string
	status: string
	author?: Types.ObjectId | null
	isDeleted?: boolean
	deletedAt?: Date
}

interface IProduct extends IPage {
	image?: Types.ObjectId
	gallery?: Types.ObjectId[]
	tags: Types.ObjectId[]
	categories: Types.ObjectId
	isCommentsOpen: boolean
	product_code: string
	technical_attribute: string
	models: number
	introduction: string
}

interface ITicket {
	code: string
	client: Types.ObjectId
	// client: string
	topic: string
	department: string
	status: string
	messages: any[]
	isDeleted?: boolean
	deletedAt?: Date
}

interface ISetting {
	name: string
	phoneNumber: string
	telegram: string
	instagram: string
	whatsapp: string
	rubika: string
	eita: string
	address: string
	favIcon?: File
	logo?: File
	description?: string
	indexed?: boolean
}
interface IMeta {
	page_id: Types.ObjectId
	mtitle: String
	mdesc: String
	keywords: String
	permalink: String
	canonical: String
	markup: String
	mindex: String
	mfollow: String
}

export type {
	ICategory,ICustomerCat,
	IMeta, ITeams,
	IClient, IUser,
	ILead, ICustomer,
	IFile, IExpert,
	IOTP, IEmploye,
	IPage,
	IProduct,
	ITicket,
	ISetting,
}
