// EditableTextBox.tsx
import React, { useState, useEffect, useRef } from 'react';

interface EditableTextBoxProps {
  id: string;
  initialText: string;
  x: number;
  y: number;
  onUpdateText: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

const EditableTextBox: React.FC<EditableTextBoxProps> = ({
  id,
  initialText,
  x,
  y,
  onUpdateText,
  onDelete
}) => {
  const [text, setText] = useState(initialText);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        onDelete(id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, onDelete]);

  useEffect(() => {
    if (textRef.current) {
      const handleBlur = () => {
        onUpdateText(id, text);
      };
      const node = textRef.current;
      node.addEventListener('blur', handleBlur);
      return () => node.removeEventListener('blur', handleBlur);
    }
  }, [text, id, onUpdateText]);

  return (
    <div
      ref={textRef}
      contentEditable
      suppressContentEditableWarning
      style={{
        position: 'absolute',
        left: x,
        top: y,
        background: 'rgba(255,255,255,0.8)',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        minWidth: '100px',
        minHeight: '30px',
        cursor: 'text',
        outline: 'none',
        fontSize: '16px'
      }}
      onInput={(e) => setText((e.target as HTMLElement).innerText)}
    >
      {text}
    </div>
  );
};

export default EditableTextBox;
