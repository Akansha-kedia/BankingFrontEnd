import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CrudOperationAssignment() {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [balance, setBalance] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [editingPost, setEditingPost] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!name || name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!age || isNaN(age) || age < 0 || age > 120) {
      newErrors.age = 'Age must be a number between 0 and 120.';
    }

    if (!balance || isNaN(balance) || balance < 0) {
      newErrors.balance = 'Balance must be a positive number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Email must be a valid email address.';
    }

    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      newErrors.phone = 'Phone must be a valid 10-digit number.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    axios.get('http://localhost:8888/cust/read')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the posts!', error);
      });
  }, [[posts]]);

  // Create a new post
  const createPost = () => {
    axios.post('http://localhost:8888/cust/add', {
      name,
      age,
      balance,
      email,
      phone,
    })
      .then(response => {
        setPosts([...posts, response.data]);
        setName('');
        setAge('');
        setBalance('');
        setEmail('');
        setPhone('');
      })
      .catch(error => {
        console.error('There was an error creating the post!', error);
      });
  };

  // Update a post
  const updatePost = (post) => {
    axios.put(`http://localhost:8888/cust/update/${post.id}`, post)
      .then(response => {
        setPosts(posts.map(p => (p.id === post.id ? response.data : p)));
        setEditingPost(null);
        setName('');
        setAge('');
        setBalance('');
        setEmail('');
        setPhone('');
      })
      .catch(error => {
        console.error('There was an error updating the post!', error);
      });
  };

  // Delete a post
  const deletePost = (id) => {
    axios.delete(`http://localhost:8888/cust/delete/${id}`)
      .then(() => {
        setPosts(posts.filter(post => post.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the post!', error);
      });
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setName(post.name);
    setAge(post.age);
    setBalance(post.balance);
    setEmail(post.email);
    setPhone(post.phone);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (validate()) {
      if (editingPost) {
        updatePost({ ...editingPost, name, age, balance, email, phone });
      } else {
        createPost();
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">React Axios CRUD Example</h1>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <form className="bg-light p-4 border rounded" onSubmit={handleSaveClick}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              {errors.age && <div className="text-danger">{errors.age}</div>}
            </div>
            <div className="form-group">
              <label>Balance</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
              {errors.balance && <div className="text-danger">{errors.balance}</div>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <div className="text-danger">{errors.phone}</div>}
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              {editingPost ? 'Update Post' : 'Add Post'}
            </button>
          </form>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <table className="table table-bordered table-striped" >
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Balance</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'aliceblue' }}>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>{post.name}</td>
                  <td>{post.age}</td>
                  <td>{post.balance}</td>
                  <td>{post.email}</td>
                  <td>{post.phone}</td>
                  <td>
                    <button className="btn btn-info btn-sm mr-2" onClick={() => handleEditClick(post)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deletePost(post.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CrudOperationAssignment;
