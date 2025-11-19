import { useState, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter detailed instruction for students',
  error,
  className = ''
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: LinkIcon, command: 'createLink', title: 'Insert Link', requiresValue: true },
    { icon: Image, command: 'insertImage', title: 'Insert Image', requiresValue: true },
  ];

  const handleButtonClick = (command: string, requiresValue?: boolean) => {
    if (requiresValue) {
      const value = prompt(`Enter ${command === 'createLink' ? 'URL' : 'image URL'}:`);
      if (value) {
        execCommand(command, value);
      }
    } else {
      execCommand(command);
    }
  };

  return (
    <div className={`${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 border border-b-0 border-gray-300 rounded-t-md p-2 bg-gray-50">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleButtonClick(button.command, button.requiresValue)}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title={button.title}
          >
            <button.icon className="w-4 h-4 text-gray-700" />
          </button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: value }}
        className={`min-h-[120px] p-3 border rounded-b-md outline-none ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : isFocused
            ? 'border-blue-500 ring-1 ring-blue-500'
            : 'border-gray-300'
        }`}
        data-placeholder={placeholder}
        style={{
          ...(value === '' && {
            position: 'relative',
          }),
        }}
      />

      {/* Placeholder styling */}
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          cursor: text;
        }
      `}</style>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
