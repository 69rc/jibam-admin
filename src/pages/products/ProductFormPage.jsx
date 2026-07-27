import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdArrowBack, MdCloudUpload } from 'react-icons/md';
import { productAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id).then((r) => r.data.data.product),
    enabled: isEdit,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => categoryAPI.getAll({ limit: 100 }).then((r) => r.data.data),
  });

  useEffect(() => {
    if (product) {
      reset({
        name:                product.name,
        categoryId:          product.categoryId,
        description:         product.description,
        manufacturer:        product.manufacturer,
        dosage:              product.dosage,
        price:               product.price,
        comparePrice:        product.comparePrice,
        stock:               product.stock,
        prescriptionRequired: product.prescriptionRequired,
        isFeatured:          product.isFeatured,
        isNewArrival:        product.isNewArrival,
        isBestSeller:        product.isBestSeller,
        sideEffects:         product.sideEffects,
        usageInstructions:   product.usageInstructions,
        isActive:            product.isActive,
      });
      if (product.image) setImagePreview(product.image);
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (formData) =>
      isEdit ? productAPI.update(id, formData) : productAPI.create(formData),
    onSuccess: () => {
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      queryClient.invalidateQueries(['products']);
      navigate('/products');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Operation failed'),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Convert boolean values to strings for FormData
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value);
        }
      }
    });
    const primaryFile = document.getElementById('product-image')?.files[0];
    if (primaryFile) formData.append('image', primaryFile);
    const moreFiles = document.getElementById('additional-images')?.files;
    if (moreFiles) Array.from(moreFiles).forEach((f) => formData.append('images', f));
    mutation.mutate(formData);
  };

  // ── Shared section label style ────────────────────────
  const sectionLabel = (
    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#0D1B5E' }} />
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          style={{ color: '#0D1B5E' }}
        >
          <MdArrowBack className="text-xl" />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#0D1B5E' }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Fill in the product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left col (2 cols wide) ─────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic info */}
            <div className="card space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#0D1B5E' }}>
                Basic Information
              </p>

              <div>
                <label className="label">Product Name *</label>
                <input
                  {...register('name', { required: 'Product name is required' })}
                  className="input"
                  placeholder="e.g. Amoxicillin 500mg"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category *</label>
                  <select
                    {...register('categoryId', { required: 'Category is required' })}
                    className="input"
                  >
                    <option value="">Select category</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Manufacturer</label>
                  <input {...register('manufacturer')} className="input" placeholder="e.g. Pfizer" />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="input resize-none"
                  placeholder="Describe this medicine…"
                />
              </div>

              <div>
                <label className="label">Dosage</label>
                <input {...register('dosage')} className="input" placeholder="e.g. 500mg tablet" />
              </div>

              <div>
                <label className="label">Side Effects</label>
                <textarea
                  {...register('sideEffects')}
                  rows={2}
                  className="input resize-none"
                  placeholder="Known side effects…"
                />
              </div>

              <div>
                <label className="label">Usage Instructions</label>
                <textarea
                  {...register('usageInstructions')}
                  rows={2}
                  className="input resize-none"
                  placeholder="How to use this medicine…"
                />
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="card space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#0D1B5E' }}>
                Pricing & Inventory
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Price (₦) *</label>
                  <input
                    {...register('price', {
                      required: 'Price is required',
                      min: { value: 0, message: 'Must be positive' },
                    })}
                    type="number"
                    step="0.01"
                    className="input"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                  )}
                </div>
                <div>
                  <label className="label">Compare Price (₦)</label>
                  <input
                    {...register('comparePrice')}
                    type="number"
                    step="0.01"
                    className="input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="label">Stock *</label>
                  <input
                    {...register('stock', {
                      required: 'Stock is required',
                      min: { value: 0, message: 'Cannot be negative' },
                    })}
                    type="number"
                    className="input"
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right col ──────────────────────────────── */}
          <div className="space-y-5">

            {/* Primary image */}
            <div className="card space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#0D1B5E' }}>
                Primary Image
              </p>
              <label htmlFor="product-image" className="cursor-pointer block">
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover border"
                      style={{ borderColor: '#EDF0F8' }}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                      <p className="text-white text-sm font-semibold">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors hover:border-cyan-400"
                    style={{ borderColor: '#DDE2F0', backgroundColor: '#F4F6FB' }}
                  >
                    <MdCloudUpload className="text-4xl text-slate-400" />
                    <p className="text-sm text-slate-500">Click to upload</p>
                    <p className="text-xs text-slate-400">JPEG, PNG, WebP — max 5 MB</p>
                  </div>
                )}
              </label>
              <input
                id="product-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) setImagePreview(URL.createObjectURL(f));
                }}
              />
            </div>

            {/* Additional images */}
            <div className="card space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#0D1B5E' }}>
                Additional Images
              </p>
              <label htmlFor="additional-images" className="cursor-pointer block">
                <div
                  className="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center gap-1 transition-colors hover:border-cyan-400 text-center"
                  style={{ borderColor: '#DDE2F0' }}
                >
                  <MdCloudUpload className="text-3xl text-slate-400" />
                  <p className="text-xs text-slate-500">Up to 4 more images</p>
                </div>
              </label>
              <input
                id="additional-images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) =>
                  setAdditionalPreviews(
                    Array.from(e.target.files).map((f) => URL.createObjectURL(f))
                  )
                }
              />
              {additionalPreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {additionalPreviews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-full h-20 object-cover rounded-xl border"
                      style={{ borderColor: '#EDF0F8' }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Flags */}
            <div className="card space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#0D1B5E' }}>
                Product Flags
              </p>
              {[
                { key: 'prescriptionRequired', label: 'Prescription Required' },
                { key: 'isFeatured',           label: 'Featured Product'      },
                { key: 'isNewArrival',          label: 'New Arrival'           },
                { key: 'isBestSeller',          label: 'Best Seller'           },
                { key: 'isActive',              label: 'Active / Visible'      },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    {...register(key)}
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#0D1B5E' }}
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-secondary px-8"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary px-8"
          >
            {mutation.isPending ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
