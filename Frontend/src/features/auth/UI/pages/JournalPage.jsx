import { useCallback, useEffect, useState } from "react";

import toast from "react-hot-toast";

import api from "../../../../shared/services/api";
import Modal from "../../../../shared/components/Modal";
import JournalEntryList from "./journal/JournalEntryList";
import JournalFilters from "./journal/JournalFilters";
import JournalForm from "./journal/JournalForm";
import JournalPagination from "./journal/JournalPagination";

const defaultFormData = {
  topicName: "",
  description: "",
  studyDuration: "",
  difficultyLevel: "Easy",
};

const defaultPagination = {
  page: 1,
  limit: 6,
  totalEntries: 0,
  totalPages: 1,
};

const normalizeEntriesResponse = (data, fallbackPage = 1) => {
  if (Array.isArray(data)) {
    return {
      entries: data,
      pagination: {
        page: fallbackPage,
        limit: data.length || defaultPagination.limit,
        totalEntries: data.length,
        totalPages: 1,
      },
    };
  }

  return {
    entries: Array.isArray(data?.entries) ? data.entries : [],
    pagination: {
      ...defaultPagination,
      ...data?.pagination,
      page: Number(data?.pagination?.page) || fallbackPage,
      limit: Number(data?.pagination?.limit) || defaultPagination.limit,
      totalEntries: Number(data?.pagination?.totalEntries) || 0,
      totalPages: Number(data?.pagination?.totalPages) || 1,
    },
  };
};

const JournalPage = () => {
  let [formData, setFormData] = useState(defaultFormData);

  let [editFormData, setEditFormData] = useState(defaultFormData);

  let [entries, setEntries] = useState([]);

  let [loading, setLoading] = useState(false);

  let [listLoading, setListLoading] = useState(false);

  let [entryToEdit, setEntryToEdit] = useState(null);

  let [entryToDelete, setEntryToDelete] = useState(null);

  let [searchText, setSearchText] = useState("");

  let [selectedDifficulty, setSelectedDifficulty] = useState("");

  let [currentPage, setCurrentPage] = useState(1);

  let [pagination, setPagination] = useState(defaultPagination);

  let buildQuery = useCallback(
    (page = currentPage) => {
      let params = new URLSearchParams({
        topic: searchText,
        page: String(page),
        limit: String(defaultPagination.limit),
      });

      if (selectedDifficulty) {
        params.set("difficulty", selectedDifficulty);
      }

      return `/journal/search/filter?${params.toString()}`;
    },
    [currentPage, searchText, selectedDifficulty],
  );

  let loadEntries = useCallback(
    async (page = currentPage) => {
      let response = await api.get(buildQuery(page));

      let normalizedData = normalizeEntriesResponse(response.data, page);

      setEntries(normalizedData.entries);
      setPagination(normalizedData.pagination);
    },
    [buildQuery, currentPage],
  );

  let handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  let handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  let handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let response = await api.post("/journal/add", formData);

      toast.success(response.data.message);

      setFormData(defaultFormData);
      setCurrentPage(1);
      await loadEntries(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  let openEditModal = (entry) => {
    setEntryToEdit(entry);
    setEditFormData({
      topicName: entry.topicName,
      description: entry.description,
      studyDuration: entry.studyDuration,
      difficultyLevel: entry.difficultyLevel,
    });
  };

  let closeEditModal = () => {
    setEntryToEdit(null);
    setEditFormData(defaultFormData);
  };

  let handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!entryToEdit) {
      return;
    }

    try {
      setLoading(true);

      let response = await api.put(
        `/journal/edit/${entryToEdit._id}`,
        editFormData,
      );

      toast.success(response.data.message);

      closeEditModal();
      await loadEntries();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  let handleDelete = async () => {
    if (!entryToDelete) {
      return;
    }

    try {
      let response = await api.delete(`/journal/delete/${entryToDelete._id}`);

      toast.success(response.data.message);

      setEntryToDelete(null);
      await loadEntries();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  let handleSearchChange = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  let handleDifficultyChange = (value) => {
    setSelectedDifficulty(value);
    setCurrentPage(1);
  };

  let handlePageChange = async (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    let isMounted = true;

    let timeout = setTimeout(() => {
      setListLoading(true);

      api
        .get(buildQuery())
        .then((response) => {
          if (isMounted) {
            let normalizedData = normalizeEntriesResponse(
              response.data,
              currentPage,
            );

            setEntries(normalizedData.entries);
            setPagination(normalizedData.pagination);
          }
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Failed to load entries",
          );
        })
        .finally(() => {
          if (isMounted) {
            setListLoading(false);
          }
        });
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [buildQuery, currentPage]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-blue-600">Learning Journal</h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Track your learning journey.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-bold">Add Journal Entry</h2>

        <JournalForm
          formData={formData}
          loading={loading}
          onChange={handleFormChange}
          onSubmit={handleAddSubmit}
          submitLabel="Add Entry"
        />
      </div>

      <JournalFilters
        searchText={searchText}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={handleDifficultyChange}
        onSearchChange={handleSearchChange}
      />

      <JournalEntryList
        entries={entries}
        loading={listLoading}
        totalEntries={pagination.totalEntries}
        onDelete={setEntryToDelete}
        onEdit={openEditModal}
      />

      <JournalPagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <Modal
        isOpen={Boolean(entryToEdit)}
        onClose={closeEditModal}
        title="Edit Journal Entry"
      >
        <JournalForm
          formData={editFormData}
          loading={loading}
          onCancel={closeEditModal}
          onChange={handleEditFormChange}
          onSubmit={handleEditSubmit}
          submitLabel="Update Entry"
        />
      </Modal>

      <Modal
        isOpen={Boolean(entryToDelete)}
        onClose={() => setEntryToDelete(null)}
        title="Delete Journal Entry"
      >
        <p className="mb-6 text-slate-600 dark:text-slate-300">
          Are you sure you want to delete "{entryToDelete?.topicName}"?
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setEntryToDelete(null)}
            className="rounded-xl px-5 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default JournalPage;
