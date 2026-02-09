'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import NoteCard from '@/components/NoteCard'
import NoteModal from '@/components/NoteModal'
import SearchBar from '@/components/SearchBar'

export default function Notes() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user, searchTerm, selectedTags])

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('q', searchTerm)
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','))

      const response = await api.get(`/notes?${params.toString()}`)
      setNotes(response.data.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      await api.delete(`/notes/${id}`)
      setNotes(notes.filter(note => note._id !== id))
    } catch (error) {
      alert('Error deleting note')
    }
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingNote(null)
    fetchNotes()
  }

  const allTags = [...new Set(notes.flatMap(note => note.tags))]

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Note
        </button>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        availableTags={allTags}
        placeholder="Search notes..."
      />

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No notes found. Create your first note!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <NoteModal
          note={editingNote}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}
