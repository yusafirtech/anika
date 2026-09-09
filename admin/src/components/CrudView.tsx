import React, { useState, useMemo } from 'react';
import { FieldDef } from '../types';
import { ImageUploadButton } from './ImageUploadButton';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Sparkles,
  Layers,
} from 'lucide-react';
import DOMPurify from 'dompurify';

interface CrudViewProps<T extends { id: string }> {
  title: string;
  subtitle?: string;
  fields: FieldDef[];
  items: T[];
  onSave: (item: Partial<T>) => void;
  onDelete: (id: string) => void;
  resourceKey?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  primaryKey?: keyof T;
}

export function CrudView<T extends { id: string }>({
  title,
  subtitle,
  fields,
  items,
  onSave,
  onDelete,
  canCreate = true,
  canEdit = true,
  canDelete = true,
}: CrudViewProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Modals state
  const [editingItem, setEditingItem] = useState<Partial<T> | null>(null);
  const [viewingItem, setViewingItem] = useState<T | null>(null);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New item draft state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [arrayInputValues, setArrayInputValues] = useState<Record<string, string>>({});

  // Filter items
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter((item) =>
      Object.values(item).some((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(term);
        }
        if (Array.isArray(val)) {
          return (val as any[]).some((v: any) => String(v).toLowerCase().includes(term));
        }
        return false;
      })
    );
  }, [items, searchTerm]);

  // Paginated items
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Handlers
  const handleOpenAdd = () => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === 'array') initial[f.key] = [];
      else if (f.type === 'boolean') initial[f.key] = false;
      else if (f.type === 'number') initial[f.key] = 0;
      else if (f.type === 'select' && f.options?.length) initial[f.key] = f.options[0];
      else initial[f.key] = '';
    });
    setFormData(initial);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: T) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleFormChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddArrayItem = (key: string) => {
    const inputVal = arrayInputValues[key]?.trim();
    if (!inputVal) return;
    const currentArray = (formData[key] as string[]) || [];
    if (!currentArray.includes(inputVal)) {
      setFormData((prev) => ({
        ...prev,
        [key]: [...currentArray, inputVal],
      }));
    }
    setArrayInputValues((prev) => ({ ...prev, [key]: '' }));
  };

  const handleRemoveArrayItem = (key: string, indexToRemove: number) => {
    const currentArray = (formData[key] as string[]) || [];
    setFormData((prev) => ({
      ...prev,
      [key]: currentArray.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Partial<T>);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {canCreate && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> Add New {title.replace(/s$/, '')}
          </button>
        )}
      </div>

      {/* Control bar: search, total count, page size */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={`Search within ${title.toLowerCase()}...`}
            className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredItems.length}</strong> items
          </span>
          <span className="text-slate-300">|</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 border border-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value={5}>5 per page</option>
            <option value={8}>8 per page</option>
            <option value={15}>15 per page</option>
            <option value={25}>25 per page</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                {fields.slice(0, 5).map((field) => (
                  <th key={field.key} className="px-5 py-3.5 font-semibold">
                    {field.label}
                  </th>
                ))}
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={fields.slice(0, 5).length + 1} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Layers className="h-8 w-8 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">No records found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search criteria or add a new record.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {fields.slice(0, 5).map((field) => {
                      const val = (item as any)[field.key];
                      return (
                        <td key={field.key} className="px-5 py-3.5">
                          {field.type === 'image' ? (
                            val ? (
                              <div className="relative h-10 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                <img
                                  src={val}
                                  alt="Preview"
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="flex h-10 w-12 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                                <ImageIcon className="h-4 w-4" />
                              </div>
                            )
                          ) : field.type === 'boolean' ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                val
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {val ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                              {val ? 'Yes' : 'No'}
                            </span>
                          ) : field.type === 'array' ? (
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {Array.isArray(val) &&
                                val.slice(0, 2).map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200"
                                  >
                                    {t}
                                  </span>
                                ))}
                              {Array.isArray(val) && val.length > 2 && (
                                <span className="text-[10px] text-slate-400">+{val.length - 2}</span>
                              )}
                            </div>
                          ) : (
                            <span className="line-clamp-2 max-w-xs font-medium text-slate-800">
                              {val !== undefined && val !== null ? String(val) : '—'}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingItem(item)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/80 border-t border-slate-200 text-xs text-slate-500">
          <span>
            Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
            <strong className="text-slate-800">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Slide-over Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingItem ? `Edit ${title.replace(/s$/, '')}` : `Create New ${title.replace(/s$/, '')}`}
                </h3>
                <p className="text-xs text-slate-500">Configure parameters below according to schema.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="mt-6 space-y-4 max-h-[65vh] overflow-y-auto pr-2">
              {fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>
                    {field.translatable && (
                      <span className="inline-flex items-center gap-1 rounded bg-teal-50 px-1.5 py-0.5 text-[9px] font-semibold text-teal-700 border border-teal-200">
                        <Sparkles className="h-2.5 w-2.5" /> AI Translatable
                      </span>
                    )}
                  </div>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFormChange(field.key, e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFormChange(field.key, e.target.value)}
                      className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'boolean' ? (
                    <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={!!formData[field.key]}
                        onChange={(e) => handleFormChange(field.key, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-xs font-medium text-slate-700">Enable / Active</span>
                    </label>
                  ) : field.type === 'image' ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <ImageUploadButton
                          label="Upload from Device"
                          currentUrl={formData[field.key]}
                          onImageUploaded={(url) => handleFormChange(field.key, url)}
                        />
                        <input
                          type="text"
                          value={formData[field.key] || ''}
                          placeholder="or paste image URL (e.g. /images/... or https://...)"
                          onChange={(e) => handleFormChange(field.key, e.target.value)}
                          className="flex-1 min-w-[160px] rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                      {formData[field.key] && (
                        <div className="relative h-28 w-40 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          <img
                            src={formData[field.key]}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ) : field.type === 'array' ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type tag/item and click Add"
                          value={arrayInputValues[field.key] || ''}
                          onChange={(e) =>
                            setArrayInputValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddArrayItem(field.key);
                            }
                          }}
                          className="flex-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddArrayItem(field.key)}
                          className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-200"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-xl bg-slate-50 border border-slate-200">
                        {((formData[field.key] as string[]) || []).map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 border border-teal-200 px-2 py-0.5 text-xs text-teal-700"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => handleRemoveArrayItem(field.key, idx)}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) =>
                        handleFormChange(
                          field.key,
                          field.type === 'number' ? Number(e.target.value) : e.target.value
                        )
                      }
                      className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-teal-600/20 hover:bg-teal-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Item Detail Overview</h3>
              <button
                onClick={() => setViewingItem(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto text-xs">
              {fields.map((field) => {
                const val = (viewingItem as any)[field.key];
                return (
                  <div key={field.key} className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                    <span className="font-semibold text-slate-500">{field.label}:</span>
                    <div className="col-span-2 text-slate-800">
                      {field.type === 'image' && val ? (
                        <div className="h-28 w-40 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          <img src={val} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      ) : Array.isArray(val) ? (
                        <div className="flex flex-wrap gap-1">
                          {val.map((tag, i) => (
                            <span
                              key={i}
                              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-teal-700 border border-slate-200 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(String(val ?? '—')),
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Confirm Record Deletion</h4>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Are you sure you want to permanently delete this item? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-rose-600/20 hover:bg-rose-500"
              >
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
