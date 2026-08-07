import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';

const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ HTMLAttributes: { class: 'bg-yellow-200' } })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none w-full min-h-[500px] text-justify',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="tiptap-container w-full h-full">
      <EditorContent editor={editor} className="w-full h-full" />
    </div>
  );
};

export default TiptapEditor;
