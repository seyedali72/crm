'use client'

import { addContactToCompany, editContactCompany, getCompanies } from "@/app/action/company.action"
import { editContact } from "@/app/action/contact.action"
import { createCustomer } from "@/app/action/customer.action"
import { addCustomerToCustomerCat, editCustomerFromCustomerCat, getCustomerCats } from "@/app/action/customerCat.action"
import { addCustomerToExpert, deleteLeadFromExpert } from "@/app/action/expert.action"
import { deleteLead, editLead } from "@/app/action/lead.action"
import { useUser } from "@/app/context/UserProvider"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function MoreInfo({ singleLead, mutated, owner }: any) {
    const [companyList, setCompanyList] = useState<any>([])
    const [catList, setCatList] = useState<any>([])
    const [popup, setPopup] = useState(false)
    const [edited, setEdited] = useState(false)
    const [editedCat, setEditedCat] = useState(false)
    const [status, setStatus] = useState('')
    const [companyId, setCompanyId] = useState<any>()
    const [catId, setCatId] = useState<any>()
    const { user } = useUser()
    const router = useRouter()
    const fetchData = useCallback(async () => {
        let company = await getCompanies({ isDeleted: false })
        setCompanyList(company)
        let categories = await getCustomerCats({ isDeleted: false })
        setCatList(categories)
    }, [])
    const changeStatus = async (type: string) => {
        let status = { status: type }
        let res = await editContact(singleLead?.contactId?._id, status)
        if (!res.error) {
            await editLead(singleLead?._id, {}, user?._id)
            toast.success('انجام شده')
            mutated()
        } else {
            toast.error('ridi')
        }
    }
    let a = singleLead?.edits?.length > 0 ? Date.parse(singleLead?.edits[singleLead?.edits?.length - 1]?.time) : 0
    let b = singleLead?.call?.length > 0 ? Date.parse(singleLead?.call[singleLead?.call?.length - 1]?.time) : 0
    let c = singleLead?.dialog?.length > 0 ? Date.parse(singleLead?.dialog[singleLead?.dialog?.length - 1]?.time) : 0
    let lastActivityArr = [a, b, c]
    const lastActivityResult = lastActivityArr.reduce((c: any, d: any) => Math.max(c, d));

    const convertToCustomer = async (expertId = singleLead?.expert?._id) => {
        let data = singleLead
        data.expert = expertId
        data.status = 'مشتری جدید'
        let res = await createCustomer(data, user?._id)
        if (res?._id !== undefined) {
            let time = Date.now()
            await deleteLead(singleLead?._id)
            await addCustomerToExpert(res?._id, { assignedAt: time }, expertId)
            await deleteLeadFromExpert(singleLead?._id, expertId)
            router.replace('/expert/leads')
        } else {
            toast.error('متاسفانه تبدیل سرنخ به مشتری انجام نشد')
        }
    }
    const addToCategory = async (contactId: any) => {
        let res = await addCustomerToCustomerCat(catId, contactId, 'lead')
        if (!res?.error) {
            await editLead(singleLead?._id, {}, user?._id)
            mutated()
        }
    }
    const changeCategory = async (contactId: any) => {
        let res = await editCustomerFromCustomerCat(catId, contactId, 'lead', singleLead?.contactId?.categoryId?._id)
        if (!res?.error) {
            mutated()
            setEditedCat(false)
        }
    }
    const addToCompany = async (contactId: any) => {
        let res = await addContactToCompany(companyId, contactId)
        if (!res?.error) {
            mutated()
        }
    }
    const changeCompany = async (contactId: any) => {
        let res = await editContactCompany(companyId, contactId, singleLead?.contactId?.companyId?._id)
        if (!res?.error) {
            mutated()
            setEdited(false)
        }
    }

    useEffect(() => { fetchData() }, [fetchData])
    return (
        <section className="main-body-container rounded">
            {!owner ? singleLead?.expert !== undefined ?
                <p className="w-100 d-flex justify-content-between align-item-center"><span>نام کارشناس: <Link href={`/account/expert/${singleLead?.expert?._id}`}> {singleLead?.expert?.employe_id?.name}</Link></span>
                    <span onClick={() => { setPopup(true) }} className="text-danger cursorPointer">تغییر کارشناس</span></p>

                : <p className="w-100 d-flex justify-content-between align-item-center"><span>بدون کارشناس</span>
                    <span onClick={() => { setPopup(true) }} className="text-danger cursorPointer">تعریف کارشناس</span></p>: ''}

            {singleLead?.assignedAt !== undefined && <p className="fs90">زمان اختصاص به کارشناس <b> {convertToPersianDate(singleLead?.assignedAt, 'YYMDHM')}</b></p>}
            <p className="fs90">زمان ساخت سرنخ <b>{convertToPersianDate(singleLead?.createdAt, "YYMDHM")}</b></p>
            {lastActivityResult !== 0 && <p className="fs90">آخرین فعالیت روی سرنخ <b>{convertToPersianDate(lastActivityResult, "YYMDHM")}  </b></p>}

            <div className="d-flex gap-1 align-items-center mb-3 fs90 text-nowrap">
                <span className="text-nowrap" >شرکت مربوطه سرنخ:</span>
                {singleLead?.contactId?.companyId == undefined ?
                    owner ? <>
                        <select onChange={(e: any) => setCompanyId(e.target.value)} className="form-control form-control-sm fs80">
                            <option value='' hidden className="fs80">یک شرکت را انتخاب کنید</option>
                            {companyList?.map((company: any) => { return (<option className="fs80" key={nanoid()} value={company?._id}>{company?.name}</option>) })}
                        </select>
                        <button onClick={() => { addToCompany(singleLead?.contactId?._id) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button>
                    </> : <b>تعریف نشده است</b>
                    : edited ?
                        <>
                            <select onChange={(e: any) => setCompanyId(e.target.value)} className="form-control form-control-sm fs80">
                                <option value='' hidden>{singleLead?.contactId?.companyId?.name}</option>
                                {companyList?.map((company: any) => { return (<option key={nanoid()} value={company?._id}>{company?.name}</option>) })}
                            </select>
                            <i onClick={() => { changeCompany(singleLead?.contactId?._id) }} className="fa fa-check p-1 rounded-1 cursorPointer bg-success text-white"> </i>
                            <i onClick={() => { setEdited(!edited) }} className="fa fa-times p-1 rounded-1 cursorPointer bg-danger text-white"> </i></> : <><Link href={`/expert/companeis/${singleLead?.contactId?.companyId?._id}`}>{singleLead?.contactId?.companyId?.name}</Link>{owner && <i onClick={() => setEdited(!edited)} className="fa fa-edit cursorPointer w-100 text-start"></i>}
                        </>}
            </div>

            <div className="d-flex gap-1 align-items-center mb-3 fs90">
                <span className="text-nowrap" >زمینه فعالیتی سرنخ:</span>
                {singleLead?.contactId?.categoryId == undefined ?
                    owner ? <>
                        <select onChange={(e: any) => setCatId(e.target.value)} className="form-control form-control-sm">
                            <option value='' hidden>یک زمینه را انتخاب کنید</option>
                            {catList?.map((cat: any) => { return (<option key={nanoid()} value={cat?._id}>{cat?.name}</option>) })}
                        </select>
                        <button onClick={() => { addToCategory(singleLead?.contactId?._id) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button>
                    </> : <b>تعریف نشده است</b>
                    : editedCat ? <>
                        <select onChange={(e: any) => setCatId(e.target.value)} className="form-control form-control-sm">
                            <option value='' hidden>{singleLead?.contactId?.categoryId?.name}</option>
                            {catList?.map((cat: any) => { return (<option key={nanoid()} value={cat?._id}>{cat?.name}</option>) })}
                        </select>
                        <i onClick={() => { changeCategory(singleLead?.contactId?._id) }} className="fa fa-check p-1 rounded-1 cursorPointer bg-success text-white"> </i>
                        <i onClick={() => { setEditedCat(!editedCat) }} className="fa fa-times p-1 rounded-1 cursorPointer bg-danger text-white"> </i>
                    </>
                        : <> <Link href={`/expert/customers/categoreis/${singleLead?.contactId?.categoryId?._id}`}>{singleLead?.contactId?.categoryId?.name}</Link>{owner && <i onClick={() => setEditedCat(!editedCat)} className="fa fa-edit cursorPointer w-100 text-start"></i>}</>}
            </div>
            <div className="d-flex gap-1 align-items-center mb-2 fs90">
                <span >وضعیت:</span>
                <select onChange={(e: any) => setStatus(e.target.value)} className="form-control form-control-sm">
                    <option value={singleLead?.contactId?.status} hidden>{singleLead?.contactId?.status}</option>
                    {singleLead?.contactId?.status !== 'در حال بررسی' && <option value='در حال بررسی'>در حال بررسی</option>}
                    {singleLead?.contactId?.status !== 'نامرتبط' && <option value='نامرتبط'>نامرتبط</option>}
                    {singleLead?.contactId?.status !== 'از دست رفته' && <option value='از دست رفته'>از دست رفته</option>}
                    {singleLead?.contactId?.status !== 'بازیابی شده' && <option value='بازیابی شده'>بازیابی شده</option>}
                    <option value='تبدیل به مشتری'>تبدیل به مشتری</option>
                </select>
                <button onClick={() => { status === 'تبدیل به مشتری' ? convertToCustomer() : changeStatus(status) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button>
            </div>
        </section>
    )
}