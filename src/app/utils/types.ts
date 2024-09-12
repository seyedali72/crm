  import { Types } from 'mongoose'
 
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

interface IPCategory extends ICategory {
	cat_type: string
}

interface IExpert {
	employe_id: Types.ObjectId
	user_name: string
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
	email?: string
	status?: string
	source?: string
	description?: string
	dialog?: string
	call: string
	isDeleted?: boolean
	deletedAt?: Date
}

interface IEmploye {
	name: string
	mobile_number: string
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
	ICategory,
	IMeta, ITeams,
	IPCategory,
	ILead, ICustomer,
	IFile, IExpert,
	IOTP, IEmploye,
	IPage,
	IProduct,
	ITicket,
	ISetting,
}
