import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { MdAdd, MdEdit, MdDelete, MdCloudUpload } from 'react-icons/md';
import { categoryAPI } from '../../services/api';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['categories', page],
    queryFn: () => categoryAPI.getAll({ page, limit: 12, activeOnly: 'false' }).then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openAdd = () => { reset({}); setEditTarget(null); setImagePreview(null); setModalOpen(true); };
  const openEdit = (cat) => {
    reset(cat);
    setEditTarget(cat);
    setImagePreview(cat.image || null);
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: (formData) =>
      editTarget
        ? categoryAPI.update(editTarget.id, formData)
        : categoryAPI.create(formData),
    onSuccess: () => {
      toast.success(editTarget ? 'Category updated!' : 'Category created!');
      queryClient.invalidateQueries(['categories']);
      setModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryAPI.delete(id),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries(['categories']);
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Cannot delete — category has products'),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.sortOrder) formData.append('sortOrder', data.sortOrder);
    const fileInput = document.getElementById('cat-image');
    if (fileInput?.files[0]) formData.append('image', fileInput.files[0]);
    saveMutation.mutate(formData);
  };

  const categories = data?.data || [];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">
          {data?.pagination?.total || 0} categories total
        </p>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <MdAdd className="text-xl" /> Add Category
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ backgroundColor: '#E8ECF8' }} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow"
                style={{ borderColor: '#EDF0F8' }}
              >
                {/* Image */}
                <div
                  className="h-28 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: '#E8ECF8' }}
                >
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">💊</span>
                  )}
                  {!cat.isActive && (
                    <span className="absolute top-2 right-2 badge-danger">Inactive</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="font-bold text-sm truncate" style={{ color: '#0D1B5E' }}>{cat.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Sort: {cat.sortOrder}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openEdit(cat)}
                      className="flex-1 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                      style={{ color: '#0D1B5E', backgroundColor: '#E8ECF8' }}
                    >
                      <MdEdit className="text-base" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="flex-1 p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
                    >
                      <MdDelete className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="card p-0">
            <Pagination pagination={data?.pagination} onPageChange={setPage} />
          </div>
        </>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Category' : 'Add Category'}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Category Name *</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="input"
              placeholder="e.g. Antibiotics"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="input resize-none"
              placeholder="Short description…"
            />
          </div>

          <div>
            <label className="label">Sort Order</label>
            <input {...register('sortOrder')} type="number" className="input" placeholder="0" />
          </div>

          {/* Image upload */}
          <div>
            <label className="label">Image</label>
            <label htmlFor="cat-image" className="cursor-pointer block">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-36 object-cover rounded-2xl border"
                  style={{ borderColor: '#DDE2F0' }}
                />
              ) : (
                <div
                  className="w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors hover:border-cyan-500 hover:bg-cyan-50"
                  style={{ borderColor: '#DDE2F0' }}
                >
                  <MdCloudUpload className="text-3xl text-slate-400" />
                  <p className="text-xs text-slate-400">Click to upload image</p>
                </div>
              )}
            </label>
            <input
              id="cat-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) setImagePreview(URL.createObjectURL(f));
              }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex-1">
              {saveMutation.isPending ? 'Saving…' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
        loading={deleteMutation.isPending}
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? This will fail if the category has products assigned.`}
        confirmText="Delete"
      />
    </div>
  );
}
