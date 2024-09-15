import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface CartContext {
	items: any[]
	updateCart(product: any, qty: number): void
	removeFromCart(product: any): void
	countAllItems(): number
	countTotalPrice(): string
	clearCart(): void
}

const updateCartInLS = (products: any) => {
	localStorage.setItem('cartItems', JSON.stringify(products))
}

const CartContext = createContext<CartContext>({
	items: [],
	updateCart() {},
	removeFromCart() {},
	clearCart() {},
	countAllItems() {
		return 0
	},
	countTotalPrice() {
		return '0'
	},
})

const CartProvider = ({ children }: { children: ReactNode }) => {
	const [cartItems, setCartItems] = useState<any>([])

	const removeFromCart = (product: any) => {
		const newProducts = cartItems.filter((item: any) => item.product._id !== product._id)
		setCartItems(newProducts)
		updateCartInLS(newProducts)
	}

	const clearCart = () => {
		setCartItems([])
		updateCartInLS([])
	}

	const updateCart = (product: any, qty: number) => {
		const finalCartItems = [...cartItems]
		const index = cartItems.findIndex((item: any) => item.product._id === product._id)

		if (index === -1) {
			finalCartItems.push({ count: qty, product })
		} else {
			finalCartItems[index].count = qty
		}

		if (finalCartItems[index]?.count === 0) {
			removeFromCart(product)
		} else {
			setCartItems(finalCartItems)
			updateCartInLS(finalCartItems)
		}
	}

	const countAllItems = () => {
		return cartItems.reduce((total: number, cartItem: any) => total + cartItem.count, 0)
	}

	const countTotalPrice = () => {
		return cartItems
			.reduce((total: number, cartItem: any) => total + cartItem.product.price * cartItem.count, 0)
			.toFixed()
	}

	useEffect(() => {
		const result = localStorage.getItem('cartItems')
		if (result !== null) {
			setCartItems(JSON.parse(result))
		}
	}, [])

	return (
		<CartContext.Provider
			value={{
				items: cartItems,
				updateCart,
				removeFromCart,
				countTotalPrice,
				countAllItems,
				clearCart,
			}}
		>
			{children}
		</CartContext.Provider>
	)
}

export default CartProvider

export const useCart = () => useContext(CartContext)
