import { render, screen, fireEvent, act } from '@testing-library/react';
import NoteEditor from './NoteEditor';
import localforage from 'localforage';

// Mock localforage
jest.mock('localforage');

// Mock window.alert
global.alert = jest.fn();

describe('NoteEditor Component', () => {
  const cityName = 'London';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the NoteEditor component', () => {
    render(<NoteEditor cityName={cityName} />);
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Save Note')).toBeInTheDocument();
    expect(screen.getByText('Delete Note')).toBeInTheDocument();
  });

  it('loads saved note from local storage', async () => {
    const savedNote = 'This is a saved note.';
    localforage.getItem.mockResolvedValue(savedNote);

    render(<NoteEditor cityName={cityName} />);

    // Wait for the note to load
    expect(await screen.findByText(savedNote)).toBeInTheDocument();
  });

  it('saves a note to local storage', async () => {
    const newNote = 'This is a new note.';
    localforage.setItem.mockResolvedValue();

    render(<NoteEditor cityName={cityName} />);

    // Enter a new note
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: newNote } });

    // Click the "Save Note" button
    const saveButton = screen.getByText('Save Note');
    await act(async () => {
      fireEvent.click(saveButton);
    });

    // Check if localforage.setItem was called
    expect(localforage.setItem).toHaveBeenCalledWith(`note_${cityName}`, newNote);
  });

  it('deletes a note from local storage', async () => {
    localforage.removeItem.mockResolvedValue();

    render(<NoteEditor cityName={cityName} />);

    // Click the "Delete Note" button
    const deleteButton = screen.getByText('Delete Note');
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Check if localforage.removeItem was called
    expect(localforage.removeItem).toHaveBeenCalledWith(`note_${cityName}`);
  });

  it('clears the textarea after deleting a note', async () => {
    localforage.removeItem.mockResolvedValue();

    render(<NoteEditor cityName={cityName} />);

    // Enter a note
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'This is a note.' } });

    // Click the "Delete Note" button
    const deleteButton = screen.getByText('Delete Note');
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Check if the textarea is cleared
    expect(textarea.value).toBe('');
  });
});