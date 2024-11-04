export interface OrderCreateRequestDto{
    userId: string;
    products: {
        id: string;
        quantity: number;
        price: number;
    }[]
    discount: number
}