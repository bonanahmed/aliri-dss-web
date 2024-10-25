import { Editor } from "@tinymce/tinymce-react";

interface PropRTE {
  value?: string;
  onChange?: (value: string) => void;
}

export default function TinymceRTE({ value = "", onChange }: PropRTE) {
  const handleEditorChange = (content: string, editor: any) => {
    // console.log({ content });
    onChange && onChange(content);
  };

  return (
    <Editor
      apiKey="nmw2k3zm25enanz7pvwag60v9xq5j3vfgcknu269blltoyha"
      init={{
        plugins: [
          // Core editing features
          "preview",
          "importcss",
          "searchreplace",
          "autolink",
          "autosave",
          "save",
          "directionality",
          "code",
          "visualblocks",
          "visualchars",
          "fullscreen",
          "image",
          "link",
          "media",
          "codesample",
          "table",
          "charmap",
          "pagebreak",
          "nonbreaking",
          "anchor",
          "insertdatetime",
          "advlist",
          "lists",
          "wordcount",
          "help",
          "charmap",
          "quickbars",
          "emoticons",
          "accordion",
        ],
        editimage_cors_hosts: ["picsum.photos"],
        menubar: "",
        toolbar:
          "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | pagebreak codesample | ltr rtl",
        toolbar_mode: "sliding",
        height: 600,
        quickbars_selection_toolbar:
          "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
        contextmenu: "link image table",
        // toolbar: 'undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl',
      }}
      value={value}
      onEditorChange={handleEditorChange}
    />
  );
}
