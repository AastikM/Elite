import React, { useState, useEffect } from 'react';
import localforage from 'localforage';

const NoteEditor = ({ cityName }) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    const loadNote = async () => {
      const savedNote = await localforage.getItem(`note_${cityName}`);
      if (savedNote) setNote(savedNote);
    };
    loadNote();
  }, [cityName]);

  const handleSave = async () => {
    await localforage.setItem(`note_${cityName}`, note);
    alert('Note saved!');
  };

  const handleDelete = async () => {
    await localforage.removeItem(`note_${cityName}`);
    setNote(''); // Clear the note state
    alert('Note deleted!');
  };

  return (
    <div>
      <h2>Notes</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows="5"
        cols="50"
        placeholder="Enter your notes here..."
      />
      <br />
      <button onClick={handleSave}>Save Note</button>
      <button onClick={handleDelete}>Delete Note</button>
    </div>
  );
};

export default NoteEditor;