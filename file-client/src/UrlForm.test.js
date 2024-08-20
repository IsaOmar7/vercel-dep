import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UrlForm from './UrlForm';
import axios from 'axios';

jest.mock('axios');

describe('UrlForm Component', () => {
  test('renders URL input fields and buttons', () => {
    render(<UrlForm />);
    expect(screen.getByPlaceholderText('Enter URL 1')).toBeInTheDocument();
    expect(screen.getByText('Add URL')).toBeInTheDocument();
    expect(screen.getByText('Fetch Metadata')).toBeInTheDocument();
  });

  test('allows adding URL fields', () => {
    render(<UrlForm />);
    const addButton = screen.getByText('Add URL');
    fireEvent.click(addButton);
    expect(screen.getAllByPlaceholderText(/Enter URL/)).toHaveLength(4);
  });

  test('allows removing URL fields', () => {
    render(<UrlForm />);
    const addButton = screen.getByText('Add URL');
    fireEvent.click(addButton); // Add one more URL field
    fireEvent.click(addButton); // Add one more URL field
    const removeButtons = screen.getAllByText('del');
    fireEvent.click(removeButtons[0]); // Remove first added URL field
    expect(screen.getAllByPlaceholderText(/Enter URL/)).toHaveLength(4);
  });

  test('submits the form and displays metadata', async () => {
    axios.post.mockResolvedValue({
      data: [{ url: 'https://github.com/', title: 'GitHub: Let’s build from here · GitHub', description: 'GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workflows, and secure code before you commit it.', image: 'https://github.githubassets.com/assets/campaign-social-031d6161fa10.png' }]
    });
    
    render(<UrlForm />);
    fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'https://github.com/' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URL 2'), { target: { value: 'https://github.com/' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URL 3'), { target: { value: 'https://github.com/' } });
    fireEvent.click(screen.getByText('Fetch Metadata'));
    
    await waitFor(() => {
      expect(screen.queryByText('GitHub: Let’s build from here · GitHub')).toBeInTheDocument();
      expect(screen.queryByText('GitHub: Let’s build from here · GitHub')).toBeInTheDocument();
    });
  });

  test('displays error message when API request fails', async () => {
    // Mock the axios.post to simulate a failed API call
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
  
    render(<UrlForm />);
  
    // Fill three URL fields
    fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'https://github.com/' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URL 2'), { target: { value: 'https://github.com/' } });
    fireEvent.change(screen.getByPlaceholderText('Enter URL 3'), { target: { value: 'https://github.com/' } });
  
    // Submit the form
    fireEvent.click(screen.getByText('Fetch Metadata'));
  
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch metadata')).toBeInTheDocument();
    });
  });

  
  
});
