"use client";

import { useState } from "react";

const categories = [
  { key: 'FORMS', label: 'Forms' },
  { key: 'CIRCULARS', label: 'Circular/GO' },
  { key: 'SCHEME_GUIDELINES', label: 'Scheme Guidelines' },
  { key: 'REPORTS', label: 'Reports' },
];

export default function AdminDownloadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "FORMS",
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.file) {
      alert("Please fill all fields");
      return;
    }
    
    setLoading(true);
    // Mock upload logic
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      setFormData({ title: "", category: "FORMS", file: null });
      alert("Document uploaded successfully!");
    }, 1500);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Downloads Management</h1>
          <p className="text-gray-600">Manage documents and forms available for public download.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/10"
        >
          <i className="fas fa-plus"></i> Add New Document
        </button>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
          <i className="fas fa-file-download text-3xl"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No documents yet</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          You haven't uploaded any documents for the download section yet. Click the button above to start managing public downloads.
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 font-bold hover:underline"
        >
          Upload your first document
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#1e3a8a] p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Document</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Document Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Annual Report 2024"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition-all appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">PDF Document</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
                    required
                  />
                  <div className={`w-full px-4 py-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${formData.file ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 group-hover:border-blue-400 group-hover:bg-blue-50'}`}>
                    <i className={`fas ${formData.file ? 'fa-check-circle text-green-500' : 'fa-cloud-upload-alt text-gray-400'} text-2xl`}></i>
                    <span className={`text-sm font-medium ${formData.file ? 'text-green-700' : 'text-gray-500'}`}>
                      {formData.file ? formData.file.name : 'Click or Drag to upload PDF'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
                  ) : (
                    <>Upload Document</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
