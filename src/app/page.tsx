'use client'

import { useEffect, useState } from "react";
import { databases } from "./lib/appwrite";
import { ID } from "appwrite";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    inStock: true,
  });

  // READ - Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await databases.listDocuments(databaseId, collectionId);
      setProducts(res.documents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // CREATE - Add product
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        ...form,
        price: parseFloat(form.price),
      });
      setForm({ name: "", price: "", description: "", category: "", inStock: true });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // UPDATE - Toggle inStock status
  const toggleStock = async (id: string, inStock: boolean) => {
    try {
      await databases.updateDocument(databaseId, collectionId, id, { inStock: !inStock });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE - Remove a product
  const deleteProduct = async (id: string) => {
    try {
      await databases.deleteDocument(databaseId, collectionId, id);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">🛍️ Product CRUD App</h1>

      <form onSubmit={addProduct} className="max-w-lg mx-auto bg-white p-4 rounded shadow mb-8">
        <input type="text" placeholder="Product Name" className="w-full border p-2 mb-2"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

        <input type="number" placeholder="Price" className="w-full border p-2 mb-2"
          value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />

        <textarea placeholder="Description" className="w-full border p-2 mb-2"
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

        <input type="text" placeholder="Category" className="w-full border p-2 mb-2"
          value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Add Product</button>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.$id} className="bg-white shadow rounded p-4">
            <h2 className="font-semibold text-xl">{p.name}</h2>
            <p className="text-gray-600">₱{p.price}</p>
            <p>{p.description}</p>
            <p className="text-sm text-gray-500">Category: {p.category}</p>
            <p className={`mt-2 font-medium ${p.inStock ? "text-green-600" : "text-red-600"}`}>
              {p.inStock ? "In Stock" : "Out of Stock"}
            </p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => toggleStock(p.$id, p.inStock)} className="px-3 py-1 bg-yellow-400 text-white rounded">Toggle Stock</button>
              <button onClick={() => deleteProduct(p.$id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
