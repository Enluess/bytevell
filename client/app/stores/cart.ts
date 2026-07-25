import { defineStore } from 'pinia'

export interface CartItem {
    id: string
    type: string
    name: string
    price: string
    priceNumber: number
}

interface CartState {
    items: CartItem[]
}

export const useCartStore = defineStore('cart', {
    state: (): CartState => ({
        items: []
    }),

    getters: {
        totalItems: (state) => state.items.length,
        totalPrice: (state) => {
            return state.items.reduce((sum, item) => sum + item.priceNumber, 0)
        }
    },

    actions: {
        addItem(type: string, name: string, price: string) {
            // Extract numeric value from price string (e.g. "49", "200₺/ay", "1.272")
            const priceStr = price.replace(/[^0-9]/g, '')
            const priceNumber = priceStr ? parseInt(priceStr, 10) : 0

            const item: CartItem = {
                id: Math.random().toString(36).substr(2, 9),
                type,
                name,
                price,
                priceNumber
            }
            this.items.push(item)
            
            if (import.meta.client) {
                this.saveCart()
            }
        },

        removeItem(id: string) {
            const index = this.items.findIndex(item => item.id === id)
            if (index !== -1) {
                this.items.splice(index, 1)
                if (import.meta.client) {
                    this.saveCart()
                }
            }
        },

        clearCart() {
            this.items = []
            if (import.meta.client) {
                this.saveCart()
            }
        },

        saveCart() {
            localStorage.setItem('hostihub_cart', JSON.stringify(this.items))
        },

        initCart() {
            if (import.meta.client) {
                const saved = localStorage.getItem('hostihub_cart')
                if (saved) {
                    try {
                        this.items = JSON.parse(saved)
                    } catch (e) {
                        this.items = []
                    }
                }
            }
        }
    }
})
