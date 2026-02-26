import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, useCart } from '../src/context/CartContext';

describe('CartContext', () => {
    it('should initialize with an empty cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
        expect(result.current.cartItems).toEqual([]);
        expect(result.current.cartTotal).toBe(0);
    });

    it('should add an item to the cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

        act(() => {
            result.current.addToCart({ id: 1, name: 'Burger', price: 10 });
        });

        expect(result.current.cartItems).toHaveLength(1);
        expect(result.current.cartItems[0].quantity).toBe(1);
        expect(result.current.cartTotal).toBe(10);
    });

    it('should increment quantity when adding the same item', () => {
        const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

        act(() => {
            result.current.addToCart({ id: 1, name: 'Burger', price: 10 });
            result.current.addToCart({ id: 1, name: 'Burger', price: 10 });
        });

        expect(result.current.cartItems).toHaveLength(1);
        expect(result.current.cartItems[0].quantity).toBe(2);
        expect(result.current.cartTotal).toBe(20);
    });

    it('should remove an item from the cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

        act(() => {
            result.current.addToCart({ id: 1, name: 'Burger', price: 10 });
            result.current.addToCart({ id: 2, name: 'Fries', price: 4 });
            result.current.removeFromCart(1);
        });

        expect(result.current.cartItems).toHaveLength(1);
        expect(result.current.cartItems[0].id).toBe(2);
        expect(result.current.cartTotal).toBe(4);
    });
});
