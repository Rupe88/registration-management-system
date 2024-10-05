
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateUser, setUpdateUser] = useState({ username: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/auth/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/api/auth/user/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchUsers();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/auth/user/${selectedUser._id}`, updateUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchUsers();
      setSelectedUser(null);
      setUpdateUser({ username: '', email: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto py-4"
      >
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

        {error && (
          <div className="text-red-500 text-sm flex items-center mb-4">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="w-full bg-gray-100 border-b border-gray-200">
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button onClick={() => { setSelectedUser(user); setUpdateUser({ username: user.username, email: user.email }); }} className="text-indigo-600 hover:underline">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:underline">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {selectedUser && (
          <form onSubmit={handleUpdate} className="mt-4">
            <h2 className="text-lg font-semibold">Update User</h2>
            <input
              type="text"
              placeholder="Username"
              className="border rounded px-2 py-1 mr-2"
              value={updateUser.username}
              onChange={(e) => setUpdateUser({ ...updateUser, username: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-2 py-1 mr-2"
              value={updateUser.email}
              onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
              required
            />
            <button type="submit" className="bg-blue-500 text-white rounded px-4 py-1">
              Update
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
