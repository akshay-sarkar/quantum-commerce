"use client";

import { CREATE_PRODUCT_MUTATION } from "@/graphql/gql";
import { ICreateProductResponse } from "@/models";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Furniture"] as const;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  inventory: "",
  category: "",
  imageUrl: "",
  isActive: true,
};

export default function CreateProductForm() {
  const [form, setForm] = useState(emptyForm);
  const [imageError, setImageError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [createProduct, { loading }] =
    useMutation<ICreateProductResponse>(CREATE_PRODUCT_MUTATION);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (name === "imageUrl") setImageError(false);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const price = parseFloat(form.price);
    const inventory = parseInt(form.inventory, 10);

    if (isNaN(price) || price <= 0) {
      setErrorMsg("Price must be a positive number.");
      return;
    }
    if (isNaN(inventory) || inventory < 0) {
      setErrorMsg("Inventory must be a non-negative integer.");
      return;
    }

    try {
      const { data } = await createProduct({
        variables: {
          input: {
            name: form.name.trim(),
            description: form.description.trim(),
            price,
            inventory,
            category: form.category,
            imageUrl: form.imageUrl.trim(),
            isActive: form.isActive,
          },
        },
      });
      if (data?.createProduct) {
        setSuccessMsg(
          `Product "${data.createProduct.name}" created successfully.`,
        );
        setForm(emptyForm);
        setImageError(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message ?? "Failed to create product. Please try again.");
    }
  };

  const showPreview =
    form.imageUrl.trim().length > 0 &&
    !imageError &&
    (form.imageUrl.startsWith("http://") ||
      form.imageUrl.startsWith("https://"));

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2
          className="font-display text-qc-text tracking-[-0.02em] mb-1"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
        >
          Create Product
        </h2>
        <p className="text-qc-muted text-sm">
          Add a new product to the catalog.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-xs tracking-[0.12em] uppercase text-qc-muted">
            Product Name
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Wireless Noise-Cancelling Headphones"
            className="w-full bg-qc-bg border border-qc-border text-qc-text px-4 py-3 text-sm placeholder:text-qc-placeholder focus:outline-none focus:border-qc-accent transition-colors duration-200"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs tracking-[0.12em] uppercase text-qc-muted">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe the product..."
            className="w-full bg-qc-bg border border-qc-border text-qc-text px-4 py-3 text-sm placeholder:text-qc-placeholder focus:outline-none focus:border-qc-accent transition-colors duration-200 resize-none"
          />
        </div>

        {/* Price + Inventory */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs tracking-[0.12em] uppercase text-qc-muted">
              Price (USD)
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="w-full bg-qc-bg border border-qc-border text-qc-text px-4 py-3 text-sm placeholder:text-qc-placeholder focus:outline-none focus:border-qc-accent transition-colors duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs tracking-[0.12em] uppercase text-qc-muted">
              Inventory
            </label>
            <input
              name="inventory"
              type="number"
              value={form.inventory}
              onChange={handleChange}
              required
              min="0"
              step="1"
              placeholder="0"
              className="w-full bg-qc-bg border border-qc-border text-qc-text px-4 py-3 text-sm placeholder:text-qc-placeholder focus:outline-none focus:border-qc-accent transition-colors duration-200"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-xs tracking-[0.12em] uppercase text-qc-muted">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full bg-qc-bg border border-qc-border text-qc-text px-4 py-3 text-sm focus:outline-none focus:border-qc-accent transition-colors duration-200 appearance-none cursor-pointer"
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image URL + Preview */}
        <div className="space-y-2">
          <label className="block text-xs tracking-[0.12em] uppercase text-qc-muted">
            Image URL
          </label>
          <input
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            required
            placeholder="https://example.com/image.jpg"
            className="w-full bg-qc-bg border border-qc-border text-qc-text px-4 py-3 text-sm placeholder:text-qc-placeholder focus:outline-none focus:border-qc-accent transition-colors duration-200"
          />
          {showPreview && (
            <div className="mt-3 border border-qc-border p-2 inline-block">
              <img
                src={form.imageUrl}
                alt="Product preview"
                onError={() => setImageError(true)}
                className="h-32 w-32 object-cover"
              />
            </div>
          )}
          {imageError && (
            <p className="text-xs text-red-400 mt-1">
              Could not load image from this URL.
            </p>
          )}
        </div>

        {/* isActive toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={form.isActive}
            onClick={() =>
              setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
            }
            className={`relative w-10 h-5 transition-colors duration-200 focus:outline-none ${
              form.isActive ? "bg-qc-accent" : "bg-qc-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white transition-transform duration-200 ${
                form.isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm text-qc-muted">
            {form.isActive ? "Active — visible to customers" : "Inactive — hidden from catalog"}
          </span>
        </div>

        {/* Feedback */}
        {errorMsg && (
          <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/5 px-4 py-3">
            {errorMsg}
          </p>
        )}
        {successMsg && (
          <p className="text-qc-accent text-sm border border-qc-accent/30 bg-qc-accent/5 px-4 py-3">
            {successMsg}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-qc-accent text-qc-accent-on text-sm tracking-wide uppercase hover:bg-qc-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
