'use client'

import { addLeadToCompany, editCompany, editLeadCompany, getCompanies } from "@/app/action/company.action"
import { editContact } from "@/app/action/contact.action"
import { addLeatToCustomerCat, editLeadFromCustomerCat, getCustomerCats } from "@/app/action/customerCat.action"
import { addLeadToExpert, deleteLeadFromExpert, getExperts } from "@/app/action/expert.action"
import { editLead } from "@/app/action/lead.action"
import { useUser } from "@/app/context/UserProvider"
import { convertToPersianDate } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function MoreInfo({ singleLead, mutated, owner }: any) {
    const [companyList, setCompanyList] = useState<any>([])
    const [catList, setCatList] = useState<any>([])
    const [popup, setPopup] = useState(false)
    const [edited, setEdited] = useState(false)
    const [expertId, setExpertId] = useState('')
    const [editedCat, setEditedCat] = useState(false)
    const [expertsList, setExpertList] = useState<any>([])
    const [status, setStatus] = useState('')
    const [companyId, setCompanyId] = useState<any>()
    const [catId, setCatId] = useState<any>()
    const { user } = useUser()
    const fetchData = useCallback(async () => {
        let company = await getCompanies({ isDeleted: false })
        setCompanyList(company)
        let experts = await getExperts({ isDeleted: false })
        setExpertList(experts)
        let categories = await getCustomerCats({ isDeleted: false })
        setCatList(categories)
    }, [])
    const changeStatus = async (type: string) => {
        let status = { status: type }
        let res = await editLead(singleLead?._id, status, user?._id)
        if (!res.error) {
            res?.contactId !== undefined ?
            await editContact(singleLead?.contactId?._id, res) :
            await editCompany(singleLead?.companyId?._id, res)
            toast.success('انجام شده')
            mutated()
        } else {
            toast.error('ناموفق بود')
        }
    }
    let a = singleLead?.edits?.length > 0 ? Date.parse(singleLead?.edits[singleLead?.edits?.length - 1]?.time) : 0
    let b = singleLead?.call?.length > 0 ? Date.parse(singleLead?.call[singleLead?.call?.length - 1]?.time) : 0
    let c = singleLead?.dialog?.length > 0 ? Date.parse(singleLead?.dialog[singleLead?.dialog?.length - 1]?.time) : 0
    let lastActivityArr = [a, b, c]
    const lastActivityResult = lastActivityArr.reduce((c: any, d: any) => Math.max(c, d));

    const changeExpert = async (expertId: any) => {
        await deleteLeadFromExpert(singleLead?._id, singleLead?.expert?._id)
        await addLeadToExpert(singleLead?._id, expertId)
        await editLead(singleLead?._id, { expert: expertId }, user?._id)
        mutated()
    }
    const addToCategory = async (leadId: any) => {
        let res = await addLeatToCustomerCat(catId, leadId, 'lead')
        if (!res?.error) {
            await editLead(singleLead?._id, {}, user?._id)
            mutated()
        }
    }
    const changeCategory = async (leadId: any) => {
        let res = await editLeadFromCustomerCat(catId, leadId, 'lead', singleLead?.categoryId?._id)
        if (!res?.error) {
            mutated()
            setEditedCat(false)
        }
    }
    const addToCompany = async (leadId: any) => {
        let res = await addLeadToCompany(companyId, leadId)
        if (!res?.error) {
            await editLead(singleLead?._id, { companyId: companyId }, user?._id)
            mutated()
        }
    }
    const changeCompany = async (leadId: any) => {
        let res = await editLeadCompany(companyId, leadId, singleLead?.companyId?._id)
        if (!res?.error) {
            mutated()
            setEdited(false)
        }
    }
    useEffect(() => { fetchData() }, [fetchData])

    return (
        <section className="main-body-container rounded">
            {popup && <div className="popupCustom">
                <section className="main-body-container rounded">
                    <div className="d-flex justify-content-between"> <h5>کارشناس مورد نظر را انتخاب کنید</h5>
                        <button onClick={() => setPopup(false)} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                    </div>
                    <select className="form-control form-control-sm my-2 w-100" onChange={(e: any) => setExpertId(e?.target?.value)}  >
                        <option value='' hidden>کارشناس مورد نظر را انتخاب کنید</option>
                        {expertsList?.map((expert: any, idx: number) => <option key={nanoid()} value={expert?._id} >{expert?.employe_id?.name}</option>)}
                    </select>
                    <button className="btn btn-sm bg-success text-white " disabled={expertId === ''} onClick={() => [changeExpert(expertId), setPopup(false), setExpertId('')]} type="button">تغییر کارشناس</button>
                </section>
            </div>}

            {!owner ? singleLead?.expert !== undefined ?
                <p className="w-100 d-flex justify-content-between align-item-center">
                    <span>نام کارشناس: <Link href={`/account/expert/${singleLead?.expert?._id}`}> {singleLead?.expert?.employe_id?.name}</Link></span>
                    {user?.role !== 4 && <span onClick={() => { setPopup(true) }} className="text-danger cursorPointer">تغییر کارشناس</span>}
                </p>

                : <p className="w-100 d-flex justify-content-between align-item-center"><span>بدون کارشناس</span>
                    <span onClick={() => { setPopup(true) }} className="text-danger cursorPointer">تعریف کارشناس</span>
                </p>
                : user?.role !== 4 ? <p className="w-100 d-flex justify-content-between align-item-center">
                    <span>نام کارشناس: <Link href={`/account/expert/${singleLead?.expert?._id}`}> {singleLead?.expert?.employe_id?.name}</Link></span>
                    <span onClick={() => { setPopup(true) }} className="text-danger cursorPointer">تغییر کارشناس</span>
                </p>
                    : ""}

            {singleLead?.assignedAt !== undefined && <p className="fs90">زمان اختصاص به کارشناس <b> {convertToPersianDate(singleLead?.assignedAt, 'YYMDHM')}</b></p>}
            <p className="fs90">زمان ساخت سرنخ <b>{convertToPersianDate(singleLead?.createdAt, "YYMDHM")}</b></p>
            {lastActivityResult !== 0 && <p className="fs90">آخرین فعالیت روی سرنخ <b>{convertToPersianDate(lastActivityResult, "YYMDHM")}  </b></p>}

            {!singleLead?.isCompany && <div className="d-flex gap-1 align-items-center mb-3 fs90 text-nowrap">
                <span className="text-nowrap" >شرکت مربوطه سرنخ:</span>
                {singleLead?.companyId == undefined ?
                    owner ? <>
                        <select onChange={(e: any) => setCompanyId(e.target.value)} className="form-control form-control-sm fs80">
                            <option value='' hidden className="fs80">یک شرکت را انتخاب کنید</option>
                            {companyList?.map((company: any) => { return (<option className="fs80" key={nanoid()} value={company?._id}>{company?.name}</option>) })}
                        </select>
                        <button onClick={() => { addToCompany(singleLead?._id) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button>
                    </> : <b>تعریف نشده است</b>
                    : edited ?
                        <>
                            <select onChange={(e: any) => setCompanyId(e.target.value)} className="form-control form-control-sm fs80">
                                <option value='' hidden>{singleLead?.companyId?.name}</option>
                                {companyList?.map((company: any) => { return (<option key={nanoid()} value={company?._id}>{company?.name}</option>) })}
                            </select>
                            <i onClick={() => { changeCompany(singleLead?._id) }} className="fa fa-check p-1 rounded-1 cursorPointer bg-success text-white"> </i>
                            <i onClick={() => { setEdited(!edited) }} className="fa fa-times p-1 rounded-1 cursorPointer bg-danger text-white"> </i></> : <><Link href={`/expert/companeis/${singleLead?.companyId?._id}`}>{singleLead?.companyId?.name}</Link>{owner && <i onClick={() => setEdited(!edited)} className="fa fa-edit cursorPointer w-100 text-start"></i>}
                        </>}
            </div>}

            <div className="d-flex gap-1 align-items-center mb-3 fs90">
                <span className="text-nowrap" >زمینه فعالیتی سرنخ:</span>
                {singleLead?.categoryId == undefined ?
                    owner ? <>
                        <select onChange={(e: any) => setCatId(e.target.value)} className="form-control form-control-sm">
                            <option value='' hidden>یک زمینه را انتخاب کنید</option>
                            {catList?.map((cat: any) => { return (<option key={nanoid()} value={cat?._id}>{cat?.name}</option>) })}
                        </select>
                        <button onClick={() => { addToCategory(singleLead?._id) }} type="button" className="btn btn-sm bg-primary text-white">ثبت</button>
                    </> : <b>تعریف نشده است</b>
                    : editedCat ? <>
                        <select onChange={(e: any) => setCatId(e.target.value)} className="form-control form-control-sm">
                            <option value='' hidden>{singleLead?.categoryId?.name}</option>
                            {catList?.map((cat: any) => { return (<option key={nanoid()} value={cat?._id}>{cat?.name}</option>) })}
                        </select>
                        <i onClick={() => { changeCategory(singleLead?._id) }} className="fa fa-check p-1 rounded-1 cursorPointer bg-success text-white"> </i>
                        <i onClick={() => { setEditedCat(!editedCat) }} className="fa fa-times p-1 rounded-1 cursorPointer bg-danger text-white"> </i>
                    </>
                        : <> <Link href={`/expert/customers/categoreis/${singleLead?.categoryId?._id}`}>{singleLead?.categoryId?.name}</Link>{owner && <i onClick={() => setEditedCat(!editedCat)} className="fa fa-edit cursorPointer w-100 text-start"></i>}</>}
            </div>

            <div className="d-flex gap-1 align-items-center mb-2 fs90">
                <span >وضعیت:</span>{owner ?
                    <>  <select onChange={(e: any) => setStatus(e.target.value)} className="form-control form-control-sm">
                        <option value={singleLead?.status} hidden>{singleLead?.status}</option>
                        <option value='در حال بررسی'>در حال بررسی</option>
                        <option value='نامرتبط'>نامرتبط</option>
                        <option value='از دست رفته'>از دست رفته</option>
                        <option value='بازیابی شده'>بازیابی شده</option>
                    </select>
                        <button onClick={() => changeStatus(status)} type="button" className="btn btn-sm bg-primary text-white">ثبت</button></> : singleLead?.status}
            </div>


        </section>
    )
}