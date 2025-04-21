import { create } from "zustand";

interface CartState {
    products: { productId: string; count: number; size: number }[];
    updateCart: (productId: string, count: number, size: number) => void;
    setCount: (productId: string, count: number) => void;
}

export const useCart = create<CartState>((set) => ({
    products: [],
    updateCart: (productId: string, count: number, size: number) =>
        set((state) => {
            const newState =
                count > 0
                    ? state.products.findIndex(
                          (p) => p.productId === productId
                      ) != -1
                        ? {
                              products: state.products.map((p) =>
                                  p.productId === productId
                                      ? size === p.size
                                          ? {
                                                productId,
                                                count: p.count + count,
                                                size,
                                            }
                                          : {
                                                productId,
                                                count,
                                                size,
                                            }
                                      : p
                              ),
                          }
                        : {
                              products: [
                                  ...state.products,
                                  { productId, count, size },
                              ],
                          }
                    : {
                          products: state.products.filter(
                              (p) => p.productId !== productId
                          ),
                      };
            return newState;
        }),
    setCount: (productId: string, count: number) =>
        set(({ products }) => ({
            products: products.map((p) =>
                p.productId === productId
                    ? { productId, count, size: p.size }
                    : p
            ),
        })),
}));
