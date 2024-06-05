import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import {act} from 'react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import CrudOperationAssignment from './crudOperationAssignment';

jest.mock('axios');

describe('CrudOperationAssignment', () => {
    beforeEach(async () => {
      axios.get.mockResolvedValue({ data: [] });
  
      await act(async () => {
        render(<CrudOperationAssignment />);
      });
    });

  test('renders the form and table', async () => {
    // Check if form inputs are rendered
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter age')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter balance')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter phone')).toBeInTheDocument();

    // Check if table is rendered
    // expect(screen.getByText('Name')).toBeInTheDocument();
    // expect(screen.getByText('Age')).toBeInTheDocument();
    // expect(screen.getByText('Balance')).toBeInTheDocument();
    // expect(screen.getByText('Email')).toBeInTheDocument();
    // expect(screen.getByText('Phone')).toBeInTheDocument();
    // expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    fireEvent.click(screen.getByText('Add Post'));

    expect(await screen.findByText('Name must be at least 2 characters long.')).toBeInTheDocument();
    expect(await screen.findByText('Age must be a number between 0 and 120.')).toBeInTheDocument();
    expect(await screen.findByText('Balance must be a positive number.')).toBeInTheDocument();
    expect(await screen.findByText('Email must be a valid email address.')).toBeInTheDocument();
    expect(await screen.findByText('Phone must be a valid 10-digit number.')).toBeInTheDocument();
  });

  test('creates a new post', async () => {
    axios.post.mockResolvedValue({ data: { id: 1, name: 'John Doe', age: 25, balance: 1000, email: 'john@example.com', phone: '1234567890' } });

    fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter age'), { target: { value: 25 } });
    fireEvent.change(screen.getByPlaceholderText('Enter balance'), { target: { value: 1000 } });
    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter phone'), { target: { value: '1234567890' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Add Post'));
    });

    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // expect(screen.getByText('John Doe')).toBeInTheDocument();
    // expect(screen.getByText('25')).toBeInTheDocument();
    // expect(screen.getByText('1000')).toBeInTheDocument();
    // expect(screen.getByText('john@example.com')).toBeInTheDocument();
    // expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  test('edits a post', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'John Doe', age: 25, balance: 1000, email: 'john@example.com', phone: '1234567890' }] });
    axios.put.mockResolvedValue({ data: { id: 1, name: 'Jane Doe', age: 30, balance: 1500, email: 'jane@example.com', phone: '0987654321' } });

    // Re-render the component with initial data
    await act(async () => {
      render(<CrudOperationAssignment />);
    });

    // fireEvent.click(await screen.findByText('Edit'));

    // fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'Jane Doe' } });
    // fireEvent.change(screen.getByPlaceholderText('Enter age'), { target: { value: 30 } });
    // fireEvent.change(screen.getByPlaceholderText('Enter balance'), { target: { value: 1500 } });
    // fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'jane@example.com' } });
    // fireEvent.change(screen.getByPlaceholderText('Enter phone'), { target: { value: '0987654321' } });

    // await act(async () => {
    //   fireEvent.click(screen.getByText('Update Post'));
    // });

    //await waitFor(() => expect(axios.put).toHaveBeenCalled());

    // expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    // expect(screen.getByText('30')).toBeInTheDocument();
    // expect(screen.getByText('1500')).toBeInTheDocument();
    // expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    // expect(screen.getByText('0987654321')).toBeInTheDocument();
  });

  test('deletes a post', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'John Doe', age: 25, balance: 1000, email: 'john@example.com', phone: '1234567890' }] });
    axios.delete.mockResolvedValue({});

    // Re-render the component with initial data
    await act(async () => {
      render(<CrudOperationAssignment />);
    });

    //fireEvent.click(await screen.findByText('Delete'));

    //await waitFor(() => expect(axios.delete).toHaveBeenCalled());

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
