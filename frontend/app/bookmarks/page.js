'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import BookmarkCard from '@/components/BookmarkCard'
import BookmarkModal from '@/components/BookmarkModal'
import SearchBar from '@/components/SearchBar'

export default function Bookmarks() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [user, searchTerm, selectedTags])

  const fetchBookmarks = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('q', searchTerm)
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','))

      const response = await api.get(`/bookmarks?${params.toString()}`)
      setBookmarks(response.data.data)
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return

    try {
      await api.delete(`/bookmarks/${id}`)
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== id))
    } catch (error) {
      alert('Error deleting bookmark')
    }
  }

  const handleEdit = (bookmark) => {
    setEditingBookmark(bookmark)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingBookmark(null)
    fetchBookmarks()
  }

  const allTags = [...new Set(bookmarks.flatMap(bookmark => bookmark.tags))]

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Bookmark
        </button>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        availableTags={allTags}
        placeholder="Search bookmarks..."
      />

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bookmarks found. Create your first bookmark!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map(bookmark => (
            <BookmarkCard
              key={bookmark._id}
              bookmark={bookmark}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <BookmarkModal
          bookmark={editingBookmark}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}
