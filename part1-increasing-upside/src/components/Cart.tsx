"use client";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function Cart() {
  const { items: cartItems, removeItem, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4"><ShoppingCart className="w-12 h-12 text-green-600" /></div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-xl text-gray-700">Review your items and complete your purchase</p>
        </div>
      </section>

      <section className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some products from our shop to get started!</p>
              <Link href="/shop" className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 flex gap-6">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-xl font-bold text-green-600 mb-4">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 border-gray-200 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-2 hover:bg-gray-100 transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="px-4 py-2 font-semibold border-x-2 border-gray-200">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold">
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right"><p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p></div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 sticky top-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700"><span>Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-700"><span>Tax (8%)</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-700"><span>Shipping</span><span className="font-semibold">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span></div>
                    {subtotal < 50 && subtotal > 0 && <p className="text-sm text-green-600">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>}
                    <div className="border-t-2 border-gray-300 pt-3 flex justify-between text-xl font-bold text-gray-900"><span>Total</span><span>${total.toFixed(2)}</span></div>
                  </div>
                  <button className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5 mr-2" /> Proceed to Checkout
                  </button>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600"><Lock className="w-4 h-4" /><span>Secure Checkout</span></div>
                  <Link href="/shop" className="block text-center text-green-600 hover:text-green-700 font-semibold mt-4">Continue Shopping</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Lock, title: "Secure Payment", desc: "Your payment information is encrypted and secure" },
              { icon: ShoppingCart, title: "Free Shipping", desc: "On orders over $50 within Oklahoma" },
              { icon: CreditCard, title: "Easy Returns", desc: "30-day money-back guarantee on all products" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i}>
                  <div className="flex justify-center mb-3"><Icon className="w-8 h-8 text-green-600" /></div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
