import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useCallback, useEffect, useState } from 'react';
import { Bold, Italic, Link as LinkIcon, Unlink, Code2 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  rows?: number;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, rows = 3, placeholder }: RichTextEditorProps) {
  const [sourceMode, setSourceMode] = useState(false);
  const [draftHtml, setDraftHtml] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML();
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class: 'prose-editor focus:outline-none',
        style: `min-height: ${rows * 1.75}rem`,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && !(value === '' && current === '<p></p>')) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('URL', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const toggleSource = useCallback(() => {
    if (!editor) return;
    if (sourceMode) {
      onChange(draftHtml);
    } else {
      const html = editor.getHTML();
      setDraftHtml(html === '<p></p>' ? '' : html);
    }
    setSourceMode(prev => !prev);
  }, [editor, sourceMode, draftHtml, onChange]);

  if (!editor) return null;

  return (
    <div className="border border-ink-300 bg-white focus-within:border-inkred transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-ink-200 bg-cream-50">
        {!sourceMode && (
          <>
            <ToolbarButton
              active={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
            >
              <Bold size={14} />
            </ToolbarButton>
            <ToolbarButton
              active={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
            >
              <Italic size={14} />
            </ToolbarButton>
            <span className="w-px h-4 bg-ink-200 mx-1" />
            <ToolbarButton
              active={editor.isActive('link')}
              onClick={setLink}
              title="Add link"
            >
              <LinkIcon size={14} />
            </ToolbarButton>
            {editor.isActive('link') && (
              <ToolbarButton
                active={false}
                onClick={() => editor.chain().focus().unsetLink().run()}
                title="Remove link"
              >
                <Unlink size={14} />
              </ToolbarButton>
            )}
            <span className="w-px h-4 bg-ink-200 mx-1" />
          </>
        )}
        <ToolbarButton
          active={sourceMode}
          onClick={toggleSource}
          title={sourceMode ? 'Switch to visual editor' : 'Edit HTML source'}
        >
          <Code2 size={14} />
        </ToolbarButton>
      </div>
      {/* Editor / source area */}
      <div className="px-3 py-2">
        {sourceMode ? (
          <textarea
            value={draftHtml}
            onChange={e => setDraftHtml(e.target.value)}
            rows={rows + 2}
            spellCheck={false}
            className="w-full font-mono text-xs text-ink-800 leading-relaxed bg-transparent resize-y focus:outline-none"
            style={{ minHeight: `${rows * 1.75}rem` }}
          />
        ) : (
          <EditorContent editor={editor} placeholder={placeholder} />
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-ink-900 text-cream-50'
          : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
      }`}
    >
      {children}
    </button>
  );
}
