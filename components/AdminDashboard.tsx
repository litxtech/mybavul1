import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PolicyDocument } from '../types';
import { useLanguage } from '../i18n';

const PolicyEditorModal: React.FC<{
    doc: Partial<PolicyDocument> | null;
    onClose: () => void;
    onSave: () => void;
}> = ({ doc, onClose, onSave }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<PolicyDocument>>(
        doc || { slug: '', title_key: '', content_key: '', is_active: true, sort_order: 0 }
    );
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('policy_documents').upsert(formData);
        if (error) {
            alert(error.message);
        } else {
            onSave();
            onClose();
        }
        setLoading(false);
    }

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{doc?.id ? t('admin.policies.edit') : t('admin.policies.new')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title_key">{t('admin.policies.form.titleKey')}</label>
                        <input name="title_key" value={formData.title_key || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                     <div>
                        <label htmlFor="content_key">{t('admin.policies.form.contentKey')}</label>
                        <textarea name="content_key" value={formData.content_key || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={3} required />
                        <p className="text-xs text-gray-500">Note: The actual content is stored in i18n.tsx. Add new keys there first.</p>
                    </div>
                     <div>
                        <label htmlFor="slug">{t('admin.policies.form.slug')}</label>
                        <input name="slug" value={formData.slug || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="sort_order">{t('admin.policies.form.sortOrder')}</label>
                            <input type="number" name="sort_order" value={formData.sort_order || 0} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                         <div className="flex items-center pt-6">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                            <label htmlFor="is_active" className="ms-2">{t('admin.policies.form.isActive')}</label>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">{t('admin.cancel')}</button>
                        <button type="submit" disabled={loading} className="bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400">{t('admin.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


const AdminDashboard: React.FC = () => {
    const { t } = useLanguage();
    const [policies, setPolicies] = useState<PolicyDocument[]>([]);
    const [editingDoc, setEditingDoc] = useState<Partial<PolicyDocument> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchPolicies = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('policy_documents')
            .select('*')
            .order('sort_order');
        if (error) console.error(error);
        else setPolicies(data || []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);
    
    const handleDelete = async (id: string) => {
        if (window.confirm(t('admin.deleteConfirm'))) {
            const { error } = await supabase.from('policy_documents').delete().eq('id', id);
            if (error) alert(error.message);
            else fetchPolicies();
        }
    }

    return (
        <>
        {editingDoc !== null && <PolicyEditorModal doc={editingDoc} onClose={() => setEditingDoc(null)} onSave={fetchPolicies} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-8">{t('admin.title')}</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{t('admin.policies.title')}</h2>
                    <button onClick={() => setEditingDoc({})} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">{t('admin.policies.new')}</button>
                </div>
                {isLoading ? <p>{t('loading')}</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.policies.table.title')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.policies.table.slug')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.policies.table.active')}</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.policies.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {policies.map(doc => (
                                    <tr key={doc.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{t(doc.title_key)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">/policy/{doc.slug}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {doc.is_active ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => setEditingDoc(doc)} className="text-indigo-600 hover:text-indigo-900">{t('admin.policies.edit')}</button>
                                            <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-900">{t('admin.delete')}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Future admin modules can be added here */}
        </div>
        </>
    );
};

export default AdminDashboard;
