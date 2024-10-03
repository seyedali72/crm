'use client'

import { useCallback, useEffect, useState } from "react"
import { getAdminDashboard } from "../action/dashboard.action"

export default function StatisticsDashboard() {
  const [data, setData] = useState<any>()
  const fetchData = useCallback(async () => {
    let data = await getAdminDashboard()
    setData(data)
  }, [])
  useEffect(() => { fetchData() }, [fetchData])
  console.log('first',data)
  return (
    <section className="row mx-0">

      <section className=" px-0 col-12 col-md-6 col-lg-3">
        <div className="d-block mx-2 my-2 text-decoration-none  text-white ">
          <section className="card">
            <section className="card-body d-flex justify-content-between">
              <section className="info-body-card w-100 ">
                <h5 className="card-title my-3 text-center">تعداد کل سرنخ ها</h5>
                <p className="card-description text-center mb-0">{data ? data.leadLength : 0} عدد</p>
              </section>
              <section className="icon-body-card ">
                <i className="fa fa-chart-bar"></i>
              </section>
            </section>
            <section className="card-footer text-white info-footer-card bg-custom-1">
               هفت روز گذشته: {data ? data.lastWeekLeadLength : 0} عدد
            </section>
          </section>
        </div>
      </section>

      <section className=" px-0 col-12 col-md-6 col-lg-3">
        <div className="d-block mx-2 my-2 text-decoration-none  text-white ">
          <section className="card ">
            <section className="card-body d-flex justify-content-between">
              <section className="info-body-card w-100">
                <h5 className="card-title my-3 text-center">تعداد کل مشتریان</h5>
                <p className="card-description text-center mb-0">{data ? data.customerLength : 0} عدد</p>
              </section>
              <section className="icon-body-card">
                <i className="fa fa-chart-bar"></i>
              </section>
            </section>
            <section className="card-footer text-white info-footer-card  bg-custom-2">
               هفت روز گذشته: {data ? data.lastWeekCustomerLength : 0} عدد
            </section>
          </section>
        </div>
      </section>

      <section className=" px-0 col-12 col-md-6 col-lg-3">
        <div className="d-block mx-2 my-2 text-decoration-none  text-white ">
          <section className="card  ">
            <section className="card-body d-flex justify-content-between">
              <section className="info-body-card w-100">
                <h5 className="card-title my-3 text-center">تعداد کل مذاکرات</h5>
                <p className="card-description text-center mb-0">400 عدد</p>
              </section>
              <section className="icon-body-card">
                <i className="fa fa-chart-bar"></i>
              </section>
            </section>
            <section className="card-footer text-white info-footer-card bg-custom-3">
               هفت روز گذشته: 36 عدد
            </section>
          </section>
        </div>
      </section>

      <section className=" px-0 col-12 col-md-6 col-lg-3">
        <div className="d-block mx-2 my-2 text-decoration-none  text-white ">
          <section className="card ">
            <section className="card-body d-flex justify-content-between">
              <section className="info-body-card w-100">
                <h5 className="card-title my-3 text-center">تعداد کل قراردادها</h5>
                <p className="card-description text-center mb-0">140 عدد</p>
              </section>
              <section className="icon-body-card">
                <i className="fa fa-chart-bar"></i>
              </section>
            </section>
            <section className="card-footer text-white info-footer-card  bg-custom-4">
               هفت روز گذشته: 3 عدد
            </section>
          </section>
        </div>
      </section>
    </section>
  )
} 