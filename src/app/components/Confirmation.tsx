import { toast } from 'react-toastify'

export function Confirmation({ onDelete }: any) {
	return (
		<>
			<p className='toastifyText'>آیا میخواهید آیتم را پاک کنید؟</p>
			<div className='toastifyBtns justify-content-center'>
				<button className='btn btn-success' onClick={onDelete}>
					بله
				</button>
				<button className='btn btn-danger' onClick={() => toast.dismiss()}>
					خیر
				</button>
			</div>
		</>
	)
}
